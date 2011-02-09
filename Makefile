all: clean docs

clean:
	rm -rf docs

docs:
	docco lib/*.js examples/*.js
	scp -rp docs/* root@yellow:/var/www/drupal/barricane-db/
	google-chrome http://www.barricane.com/barricane-db/


