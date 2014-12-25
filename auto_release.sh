#!/bin/bash
. ~/.bash_profile

src_home=$HOME/git_src

if [ ! -d $src_home/jzj ]; then
  cd $src_home
  git clone git@github.com:juzhuanjie/jzj.git
fi

