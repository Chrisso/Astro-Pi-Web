all: astro-pi-cmd

astro-pi-cmd: astro-pi-cmd.c
	gcc --std=c99 -DSCRIPT_NAME=\"$(abspath astro-pi-cmd.py)\" -o astro-pi-cmd astro-pi-cmd.c
