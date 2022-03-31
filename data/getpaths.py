import json
from urllib.request import urlopen
import urllib
xddd={}
with open("data/borders.json", 'r+', encoding="utf-8") as svg:
    s=json.load(svg)
for x in range(len(s)):
    try:
        url=s[x]["flags"]
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as fg:
            fg=fg.read().decode('utf-8')
            fg=fg.replace('''<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1024.000000pt" height="1024.000000pt" viewBox="0 0 1024.000000 1024.000000"
 preserveAspectRatio="xMidYMid meet">
<metadata>
Created by potrace 1.10, written by Peter Selinger 2001-2011
</metadata>
<g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">''',"").replace("""</g>
</svg>""","").replace("\n\n","").replace("\n"," ").replace('"',"'")
        xddd[f'{s[x]["name"].lower()}']=fg
    except urllib.error.HTTPError:
        print(s[x]["capital"])
# print(xddd)
with open("data/paths.json","r+",encoding="utf-8") as xdddddd:
    xdddddd.write(json.dumps(xddd))
    xdddddd.close()
