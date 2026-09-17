# Builds ../index.html from index.template.html + style.css + games.json
import re, pathlib
d = pathlib.Path(__file__).parent
t = (d / "index.template.html").read_text()
t = re.sub(r"<style>.*?</style>", lambda m: "<style>\n" + (d / "style.css").read_text() + "</style>", t, count=1, flags=re.S)
(d / "index.template.html").write_text(t)
(d.parent / "index.html").write_text(t.replace("/*DATA*/", (d / "games.json").read_text()))
