#! /bin/bash
# stops all node, npm, actionhero and nodejs instances on the server.
# (re)installs node_modules for each node app.
USER=$(whoami)

if [[ $USER != "root" ]]; then
  echo "Please start the script as root"
  exit 1
fi

# echoes current time and date for logging purposes
date

# pull newest changes
#PULL=$(git pull)

# only execute if changes in git
#if [[ $PULL != "Already up-to-date." ]]; then
  # kill running processes
  pkill -9 nodejs
  pkill -9 npm
  pkill -9 actionhero
  pkill -9 node

  # build the mapping library
  cd situation_template_mapping
  rm -rf src/situationtemplate
  xjc -d src -p situationtemplate.model situation_template_draft01.xsd
  ant
  # copy the jar to the needed locations
  cp situation_template_v01.jar ../Situation\ Dashboard/public/nodeRed/mappingString.jar
  cp situation_template_v01.jar ../SitTempModelingTool/lib

  # build the modeling tool
  cd ..
  cd SitTempModelingTool
  rm -rf src/model
  xjc -d src -p model res/situation_template.xsd
  ant
  # copy the war file and the WebContent directory to the default tomcat8 locations
  cp -R WebContent/* /var/lib/tomcat8/webapps/SitTempModelingTool
  cp SitTempModelingTool.war /var/lib/tomcat8/webapps
  /etc/init.d/tomcat8 restart

  # build Sitdb + api
  cd ..
  cd Situationsverwaltung
  rm -rf node_modules
  npm install
  node_modules/.bin/swagger project start >> Sitdb.log 2>&1 &

  # build rmp
  cd ..
  cd RMP
  rm -rf node_modules
  npm install
  npm start >> rmp.log 2>&1 &

  # build the situation dashboard
  cd ..
  cd Situation\ Dashboard
  rm -rf node_modules
  npm install
  nodejs server.js >> dashboard.log 2>&1 &

  cd ../..
  
  # check if node-red directory exists if not create it and install node-red into it
  if [[ ! -d node-red ]]; then
    mkdir node-red
    cd node-red
    npm install node-red
  fi
  
  # start node-red
  cd node-red/node_modules/.bin
  ./node-red 2>&1 > /dev/null &
#fi
