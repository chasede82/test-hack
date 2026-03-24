#!/usr/bin/env python3
"""Local Whisper STT script - takes audio file path, outputs transcript to stdout"""
import sys
import whisper
import warnings

warnings.filterwarnings("ignore")

if len(sys.argv) < 2:
    print("Usage: transcribe.py <audio_file_path>", file=sys.stderr)
    sys.exit(1)

audio_path = sys.argv[1]
model = whisper.load_model("base")
result = model.transcribe(audio_path, language="ko")
print(result["text"])
