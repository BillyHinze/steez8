terraform {
  required_version = ">= 1.5.0"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 7.0"
    }
  }
}

# This stack deliberately creates only one Always Free-sized A1 Flex VM.
# Do not use paid shapes, extra paid volumes or a paid load balancer.
provider "oci" {
  region = var.region
}

variable "region" {
  type        = string
  description = "The account's OCI home region (Always Free VM must run there)."
}

variable "compartment_ocid" {
  type        = string
  description = "OCI compartment in which the VM and network will be created."
}

variable "availability_domain" {
  type        = string
  description = "Available OCI AD with Always Free Ampere A1 capacity."
}

variable "ssh_public_key" {
  type        = string
  description = "Authorized SSH public key, never a private key."
}

variable "ssh_allowed_cidr" {
  type        = string
  description = "Trusted administrator public IP in /32 notation."
  validation {
    condition     = can(cidrhost(var.ssh_allowed_cidr, 0)) && var.ssh_allowed_cidr != "0.0.0.0/0"
    error_message = "SSH must be limited to an administrator network, never open to the internet."
  }
}

resource "oci_core_vcn" "steez8" {
  compartment_id = var.compartment_ocid
  display_name   = "steez8-staging-vcn"
  cidr_blocks    = ["10.37.0.0/16"]
  dns_label      = "steez8vcn"
}

resource "oci_core_internet_gateway" "steez8" {
  compartment_id = var.compartment_ocid
  display_name   = "steez8-staging-internet"
  vcn_id         = oci_core_vcn.steez8.id
  enabled        = true
}

resource "oci_core_route_table" "public" {
  compartment_id = var.compartment_ocid
  display_name   = "steez8-staging-public-routes"
  vcn_id         = oci_core_vcn.steez8.id
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.steez8.id
  }
}

resource "oci_core_security_list" "public" {
  compartment_id = var.compartment_ocid
  display_name   = "steez8-staging-public-security"
  vcn_id         = oci_core_vcn.steez8.id

  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }

  ingress_security_rules {
    protocol = "6"
    source   = var.ssh_allowed_cidr
    tcp_options {
      min = 22
      max = 22
    }
  }

  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 80
      max = 80
    }
  }

  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 443
      max = 443
    }
  }
}

resource "oci_core_subnet" "public" {
  compartment_id             = var.compartment_ocid
  display_name               = "steez8-staging-subnet"
  vcn_id                     = oci_core_vcn.steez8.id
  cidr_block                 = "10.37.1.0/24"
  dns_label                  = "public"
  route_table_id             = oci_core_route_table.public.id
  security_list_ids          = [oci_core_security_list.public.id]
  prohibit_public_ip_on_vnic = false
}

data "oci_core_images" "ubuntu_arm" {
  compartment_id          = var.compartment_ocid
  operating_system        = "Canonical Ubuntu"
  operating_system_version = "24.04"
  shape                   = "VM.Standard.A1.Flex"
  sort_by                 = "TIMECREATED"
  sort_order              = "DESC"
}

resource "oci_core_instance" "steez8" {
  compartment_id      = var.compartment_ocid
  availability_domain = var.availability_domain
  display_name        = "steez8-staging-arm64"
  shape               = "VM.Standard.A1.Flex"

  shape_config {
    ocpus         = 2
    memory_in_gbs = 12
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.public.id
    assign_public_ip = true
    hostname_label   = "steez8"
  }

  source_details {
    source_type             = "image"
    source_id               = data.oci_core_images.ubuntu_arm.images[0].id
    boot_volume_size_in_gbs = 50
  }

  metadata = {
    ssh_authorized_keys = trimspace(var.ssh_public_key)
    user_data           = base64encode(file("${path.module}/cloud-init.yaml"))
  }
}

data "oci_core_vnic_attachments" "steez8" {
  compartment_id = var.compartment_ocid
  instance_id    = oci_core_instance.steez8.id
}

data "oci_core_vnic" "steez8" {
  vnic_id = data.oci_core_vnic_attachments.steez8.vnic_attachments[0].vnic_id
}

output "staging_ipv4" {
  value       = data.oci_core_vnic.steez8.public_ip_address
  description = "The VM's public address. Set an approved API hostname A record here before TLS activation."
}

output "ssh_example" {
  value       = "ssh ubuntu@${data.oci_core_vnic.steez8.public_ip_address}"
  description = "Use the matching SSH private key only on a trusted administrator's system."
}
