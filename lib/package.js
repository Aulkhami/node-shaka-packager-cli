import { promisify } from "util";
import child_process from "child_process"
import { mkdir } from "fs/promises";
const exec = promisify(child_process.exec);

export async function formatVideo(inputPath, outputFolder, sourceRes) {
  await mkdir(`formatted/${outputFolder}`)
  try {
    await exec(`ffmpeg.exe -i ${inputPath} -vf scale=640:360 -preset slow -crf 18 formatted/${outputFolder}/h264_baseline_360p_600.mp4`)
    await exec(`ffmpeg.exe -i ${inputPath} -vf scale=854:480 -preset slow -crf 18 formatted/${outputFolder}/h264_main_480p_1000.mp4`)
    await exec(`ffmpeg.exe -i ${inputPath} -vf scale=1280:720 -preset slow -crf 18 formatted/${outputFolder}/h264_main_720p_3000.mp4`)
    if (sourceRes === '1080p') await exec(`ffmpeg.exe -i ${inputPath} -vf scale=1920:1080 -preset slow -crf 18 formatted/${outputFolder}/h264_high_1080p_6000.mp4`)
  } catch (error) {
    throw error
  }
}

export async function packageVideo(inputFolder, outputFolder, sourceRes) {
  if (sourceRes === '1080p') await exec(`packager.exe \
    in=${inputFolder}/h264_baseline_360p_600.mp4,stream=audio,output=output/${outputFolder}/audio.mp4 \
    in=${inputFolder}/h264_baseline_360p_600.mp4,stream=video,output=output/${outputFolder}/h264_360p.mp4 \
    in=${inputFolder}/h264_main_480p_1000.mp4,stream=video,output=output/${outputFolder}/h264_480p.mp4 \
    in=${inputFolder}/h264_main_720p_3000.mp4,stream=video,output=output/${outputFolder}/h264_720p.mp4 \
    in=${inputFolder}/h264_high_1080p_6000.mp4,stream=video,output=output/${outputFolder}/h264_1080p.mp4 \
    --mpd_output output/${outputFolder}/h264.mpd`)
  if (sourceRes === '720p') await exec(`packager.exe \
    in=${inputFolder}/h264_baseline_360p_600.mp4,stream=audio,output=output/${outputFolder}/audio.mp4 \
    in=${inputFolder}/h264_baseline_360p_600.mp4,stream=video,output=output/${outputFolder}/h264_360p.mp4 \
    in=${inputFolder}/h264_main_480p_1000.mp4,stream=video,output=output/${outputFolder}/h264_480p.mp4 \
    in=${inputFolder}/h264_main_720p_3000.mp4,stream=video,output=output/${outputFolder}/h264_720p.mp4 \
    --mpd_output output/${outputFolder}/h264.mpd`)
}