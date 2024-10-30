all: jq.js jq.wasm

clean:
	rm -fr jq jq.*

jq/configure:
	git submodule update --init
	cd jq && \
	  git submodule update --init && \
	  autoreconf -fi

jq/Makefile: jq/configure
	cd jq && emconfigure ./configure --disable-maintainer-mode --disable-silent-rules --with-oniguruma=builtin

jq/jq: jq/Makefile pre.js post.js extern-post.js
	rm -f $@ # needed for emcc to replace existing file
	cd jq && env CCFLAGS=-O2 emmake make V=1 VERBOSE=1 LDFLAGS="-all-static -s EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s USE_PTHREADS=0 -s EXPORT_NAME=jq -s WASM=1 --pre-js ../pre.js --post-js ../post.js --extern-post-js ../extern-post.js" CCFLAGS=-O2 -j4

jq.js: jq/jq jq.wasm
	cp -f jq/jq ./jq.js

jq/jq.wasm: jq/jq

jq.wasm: jq/jq jq/jq.wasm
	cp -f jq/jq.wasm .

@PHONY:
test: jq.js
	node test.js
