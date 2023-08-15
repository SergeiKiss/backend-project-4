install:
	npm ci

lint:
	npx eslint .

fix-lint:
	npx eslint --fix .

test:
	npx jest

clear-test:
	clear
	npx jest

debug-run:
	DEBUG=page-loader,axios page-loader <url>

debug-clear-test:
	DEBUG=nock.* make clear-test 

test-coverage:
	npx jest --coverage