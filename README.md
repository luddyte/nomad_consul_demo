# Nomad Consul Demo

This is the minimum-est of MVP to demonstrate using consul to connect to a
service from a Node app.  It is meant to be run from within a container.  If the consul
service is not available the app will crash.  The intent is for a scheduler to
restart it should that happen.  It also assumes you are using host networking.  
Best practices were not used.
