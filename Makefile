all: clean docs

clean:
	rm -rf docs

docs:
	docco lib/*.js test/*.js
	google-chrome ./docs


