NODE ?= node
TESTS ?= "test/**/*.js"
REPORTER ?= list
TIMEOUT ?= 10000
MOCHA = ./node_modules/.bin/mocha

jshint:
	@for d in ui api; \
	do \
		cd $$d; \
		grunt jshint; \
	done

test: jshint
	@cd api; NODE_ENV=test $(NODE) $(MOCHA) \
		--bail \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

watch:
	@cd api; NODE_ENV=test $(NODE) $(MOCHA) \
		--bail \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--growl \
		--watch \
		$(TESTS)

.PHONY: test watch jshint
