# based on https://gist.github.com/passcod/4b382bc836456b77249b
#
# befofe hitting 'make' you should have a shell with emconfigure and emcc
# install emscripten and follow instructions here:
#   https://kripken.github.io/emscripten-site/docs/tools_reference/emsdk.html
# basically you must call (on bash):
#  ~/emsdk-portable/emsdk update
#  ~/emsdk-portable/emsdk install latest
#  ~/emsdk-portable/emsdk activate latest
#  source ~/emsdk-portable/emsdk_env.sh

all: jq.js jq.min.js jq.wasm.js jq.wasm.min.js jq.wasm.wasm

jq/configure:
	git submodule update --init
	cd jq && \
	  git submodule update --init && \
	  autoreconf -fi

jq/jq.o: jq/configure
	cd jq && \
	  emconfigure ./configure --disable-maintainer-mode --with-oniguruma=builtin && \
	  make clean && \
	  env CCFLAGS=-O2 emmake make LDFLAGS=-all-static CCFLAGS=-O2 -j4 && \
	  cp jq jq.o

jq.js: jq/jq.o
	cd jq && \
	  emcc -03 --memory-init-file 0 --pre-js ../pre.js --post-js ../post.js jq.o -o ../jq.js

jq.wasm.js: jq/jq.o
	cd jq && \
	  emcc -03 --memory-init-file 0 --pre-js ~/comp/jq-web/pre.js --post-js ~/comp/jq-web/post.js -s WASM=1 jq.o -o ../jq.wasm.js

jq.min.js: node_modules/.bin/uglifyjs jq.js
	./node_modules/.bin/uglifyjs jq.js -m -c -o jq.min.js

jq.wasm.min.js: node_modules/.bin/uglifyjs jq.wasm.js
	uglifyjs jq.wasm.js -m -c -o jq.wasm.min.js

test: node_modules/.bin/tape
	node test.js

node_modules/*:
	npm install
