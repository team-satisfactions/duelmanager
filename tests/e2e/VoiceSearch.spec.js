jest.setTimeout(30000)
const puppeteer = require('puppeteer');
const fs = require('fs');

describe('duelmaneger', () => {

  it('voice recoginision of "Blue-Eyes White Dragon"', async () => {
    const base64String = fs.readFileSync(`${__dirname}/Summon.mp3`, { encoding: 'base64' });
    const base64audio = `data:audio/mpeg;base64,${base64String}`

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
      ]
    })
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 800});

    await page.goto('http://localhost:18080/',{ waitUntil: 'domcontentloaded', });
    await page.waitFor(() => !!window.location.hash);

    await page.click('.voice-box button');
    await page.waitFor(1000);

    await page.evaluate((base64audio) => {
      let audio = document.createElement('audio');
      audio.setAttribute('src', base64audio);
      audio.setAttribute('controls', '');
      audio.setAttribute('style', 'display:none;');
      audio.onplay = function() {
        var stream = audio.captureStream();
        navigator.mediaDevices.getUserMedia = async function() {
          return stream;
        }
      };
      document.querySelector("body").appendChild(audio);
      audio.play()
    },base64audio);

    await page.waitFor('.voice-text > a');
    const target = await page.$(".voice-text > a");
    const text = await page.evaluate($ => $.textContent, target);

    expect(text).toMatch(/(青眼の白龍|ブルーアイズホワイトドラゴン)/)

    await page.screenshot( {
      path: `${__dirname}/../snapshot/VoiceSearch-RecognitionTest.png`,
      fullPage: true
    });
  });
});
