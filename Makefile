install:
	npm ci

lint:
	npx eslint .

test:
	npx jest

clear-test:
	clear
	npx jest

test-coverage:
	npx jest --coverage