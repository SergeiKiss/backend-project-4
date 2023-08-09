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

test-coverage:
	npx jest --coverage