#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
	char *args[argc+2]; // prepend python interpreter, append terminator
	args[0] = "python";
	args[1] = "/home/pi/projects/astro-pi-web/python-gateway/astro-pi-cmd.py";
	for (int i=1; i<argc; i++)
		args[i+1] = argv[i];
	args[argc+1] = 0;
	return execv("/usr/bin/python", args);
}
