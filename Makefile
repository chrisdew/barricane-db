all: clean docs

clean:
	rm -rf docs

docs:
	docco lib/*.js examples/*.js
	google-chrome ./docs


