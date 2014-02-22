#!/usr/bin/env bash

apt-get update
apt-get install -y couchdb

cp /vagrant/local.ini /etc/couchdb/local.ini

service couchdb start
