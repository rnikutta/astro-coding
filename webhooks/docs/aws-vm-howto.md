# How to set up a VM on Amazon

## Synopsis

## Table of Contents

## Introduction

## Signing up for an Amazon cloud account

## Setting up a VM

### Launch AWS t2.minor instance

### Add http and https output

### (Optional) Add users and roles to project

### pem key pair
- generate
- put in the right place
- chmod it

## Install and configure nginx web server

```
sudo yum install nginx  # install
sudo nginx -v  # see if it installed by printing version
sudo systemctl start nginx  # start it up
sudo systemctl enable nginx  # make it go live 
sudo systemctl status nginx  # check if it's running
```

Then, in the AWS console, copy the public-facing IP address (let's call it *serverip*).

Paste it in your browser: `http://serverip

Note: `https` does not work when on NOAO-Wifi

## References
