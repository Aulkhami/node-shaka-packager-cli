import { readdir, rm } from 'node:fs/promises'
import inquirer from 'inquirer'

import { formatVideo, packageVideo } from '../lib/package.js'
import config from '../config.json' assert { type: 'json' }

function packageVideoPromise(input) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileName = input.substr(0, input.lastIndexOf('.')) || input;

      console.log(`Formatting Video files for ${input}...`)
      await formatVideo(`input/${input}`, fileName, config.sourceRes)

      console.log(`Creating DASH Manifest file for ${input}...`)
      await packageVideo(`formatted/${fileName}`, fileName, config.sourceRes)
      await rm(`formatted/${fileName}`, { recursive: true, force: true })

      console.log(`Processes for ${input} are completed.`)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

async function initCli() {
  const inputs = await readdir('input')
  console.log('Shaka Packager Node CLI')
  console.log(`Video Inputs: ${inputs}`)
  console.log(`Config: sourceRes: ${config.sourceRes}, uploadUrl: ${config.uploadUrl}`)

  const answers = await inquirer.prompt({
    type: 'list',
    name: 'mainMenu',
    message: 'Menu',
    choices: ['Start Packaging', 'Exit']
  })

  if (answers.mainMenu === 'Start Packaging') {

    try {
      await Promise.all(inputs.map(packageVideoPromise))
    } catch (error) {
      throw error
    }
    console.log('Process Successful.')
    initCli()

  } else if (answers.mainMenu === 'Exit') {
    return
  }
}

initCli().catch((err) => console.error(err))