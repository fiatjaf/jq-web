# based on https://gist.github.com/passcod/4b382bc836456b77249b
#
# befofe hitting 'make' you should have a shell with emconfigure and emcc.
# install emscripten and follow instructions here:
#   https://kripken.github.io/emscripten-site/docs/tools_reference/emsdk.html
# basically you must call (on bash):
#  ~/emsdk-portable/emsdk update
#  ~/emsdk-portable/emsdk install latest
#  ~/emsdk-portable/emsdk activate latest
#  source ~/emsdk-portable/emsdk_env.sh

all: jq.js jq.min.js jq.wasm.js jq.wasm.min.js jq.wasm.wasm jq.bundle.js jq.bundle.min.js

clean:
	rm jq.*

jq/configure: .gitmodules
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

jq.js: jq/jq.o pre.js post.js
	cd jq && \
	  emcc -O3 -s TOTAL_MEMORY=32MB -s MODULARIZE_INSTANCE=1 -s EXPORT_NAME="jq" --memory-init-file 1 --pre-js ../pre.js --post-js ../post.js jq.o -o ../jq.js

jq.min.js: node_modules/.bin/uglifyjs jq.js
	./node_modules/.bin/uglifyjs jq.js -m -c -o jq.min.js

jq.bundle.js: jq/jq.o pre.js post.js
	cd jq && \
	  emcc -O3 -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE_INSTANCE=1 -s EXPORT_NAME="jq" --memory-init-file 0 --pre-js ../pre.js --post-js ../post.js jq.o -o ../jq.bundle.js

jq.bundle.min.js: node_modules/.bin/uglifyjs jq.bundle.js
	./node_modules/.bin/uglifyjs jq.js -m -c -o jq.bundle.min.js

jq.wasm.js: jq/jq.o pre.js post.js
	cd jq && \
	  emcc -O3 -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE_INSTANCE=1 -s EXPORT_NAME="jq" -s WASM=1 --pre-js ../pre.js --post-js ../post.js jq.o -o ../jq.wasm.js

jq.wasm.min.js: node_modules/.bin/uglifyjs jq.wasm.js
	uglifyjs jq.wasm.js -m -c -o jq.wasm.min.js

test: node_modules/.bin/tape
	node test.js

node_modules/.bin/tape:
	npm install

node_modules/.bin/uglifyjs:
	npm install
