#!/bin/bash
. ~/.bash_profile

if [ -z $CATALINA_HOME ]; then
   echo "ERROR: CATALINA_HOME is not set!"
   exit 1
fi

if [ -z $MAVEN_HOME ]; then
   echo "ERROR: MAVEN_HOME is not set!"
   exit 2
fi

echo "Shutdown tomcat application server..."
sh $CATALINA_HOME/bin/shutdown.sh

src_home=$HOME/git_src

if [ ! -d $src_home/jzj ]; then
  cd $src_home
  git clone git@github.com:juzhuanjie/jzj.git
else
  cd $src_home/jzj
  git pull origin master
fi

cd $src_home/jzj/source/jzj/
mvn clean install

echo "Start tomcat application server..."
sh $CATALINA_HOME/bin/startup.sh
