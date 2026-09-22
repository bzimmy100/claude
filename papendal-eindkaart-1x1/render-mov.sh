#!/usr/bin/env bash
# Rendert de eindkaart naar een MOV met alfakanaal.
#
#   ./render-mov.sh [fps] [codec]
#
#   fps    25 (standaard) of 30
#   codec  qtrle  (standaard) QuickTime Animation, verliesloos en compact
#          prores ProRes 4444, de studio-standaard maar een stuk zwaarder
#
# Stap 1 zet de scene frame voor frame stil via het data-om-seek-to-time-frame
# event van de engine en legt elk frame vast als PNG met alfakanaal. Stap 2
# plakt die frames aan elkaar.
set -euo pipefail
FPS="${1:-25}"
CODEC="${2:-qtrle}"
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

FFMPEG="$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')"

node "$HERE/render-frames.mjs" \
  "$HERE/Papendal Eindkaart 1x1 (standalone).html" \
  "$WORK/frames" "$FPS"

mkdir -p "$HERE/export"
OUT="$HERE/export/Papendal-Eindkaart-1x1-alpha-${FPS}fps.mov"

case "$CODEC" in
  qtrle)
    "$FFMPEG" -y -loglevel error -framerate "$FPS" -i "$WORK/frames/f%04d.png" \
      -c:v qtrle -pix_fmt argb "$OUT" ;;
  prores)
    "$FFMPEG" -y -loglevel error -framerate "$FPS" -i "$WORK/frames/f%04d.png" \
      -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le -alpha_bits 16 -vendor apl0 "$OUT" ;;
  *)
    echo "onbekende codec: $CODEC (kies qtrle of prores)" >&2; exit 1 ;;
esac

echo "klaar: $OUT"
