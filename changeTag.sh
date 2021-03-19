
##!/bin/bash
sed "s/tagVersion/$1/g" deploy.yml > deploy_latest.yml