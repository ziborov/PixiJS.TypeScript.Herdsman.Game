import './styles.css'
import { SceneManager } from './SceneManager'
import { HuntingScene } from './HuntingScene'

async function run (): Promise<void> {
  const ellipsis: HTMLElement | null = document.querySelector('.ellipsis')
  if (ellipsis != null) {
    ellipsis.style.display = 'none'
  }
  await SceneManager.initialize()
  await SceneManager.changeScene(new HuntingScene({
    viewWidth: SceneManager.width,
    viewHeight: SceneManager.height
  }))
}

run().catch((err) => {
  console.error(err)
  const div = document.createElement('div')
  const divStack = document.createElement('div')
  document.body.prepend(div)
  document.body.prepend(divStack)
  div.style.color = 'red'
  div.style.fontSize = '2rem'
  div.innerText = ((Boolean(err)) && (Boolean(err.message))) ? err.message : err
  divStack.style.color = 'red'
  divStack.style.fontSize = '2rem'
  divStack.innerText = ((Boolean(err)) && (Boolean(err.stack))) ? err.stack : ''
})
