bump :
	mvn versions:set

serve :
	cd web && npm run start;

lint :
	mvn process-sources
