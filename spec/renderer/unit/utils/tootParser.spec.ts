import { JSDOM } from 'jsdom'
import { findLink, findTag, findAccount } from '@/utils/tootParser'

describe('findLink', () => {
  describe('Pleroma', () => {
    const doc = new JSDOM(`<html><head></head><body>
<div class="toot">
<p>
I released Whalebird version 2.4.1. In version 2.4.0, Whalebird supports streaming update of Pleroma. But it contains a bug, so it is resolved in version 2.4.1.  <br /><a href="https://github.com/h3poteto/whalebird-desktop/releases/tag/2.4.1" id="link">https://github.com/h3poteto/whalebird-desktop/releases/tag/2.4.1</a><br /><a href="https://pleroma.io/tag/whalebird">#Whalebird</a>
</p>
</div>
</body>
</html>`).window.document

    const target = doc.getElementById('link')
    it('should find', () => {
      const res = findLink(target)
      expect(res).toEqual('https://github.com/h3poteto/whalebird-desktop/releases/tag/2.4.1')
    })
  })
})

describe('findTag', () => {
  describe('Pleroma', () => {
    const doc = new JSDOM(`<html><head></head><body>
<div class="toot">
<p>
I released Whalebird version 2.4.1. In version 2.4.0, Whalebird supports streaming update of Pleroma. But it contains a bug, so it is resolved in version 2.4.1.  <br /><a href="https://github.com/h3poteto/whalebird-desktop/releases/tag/2.4.1">https://github.com/h3poteto/whalebird-desktop/releases/tag/2.4.1</a><br /><a id="tag" href="https://pleroma.io/tag/whalebird">#Whalebird</a>
</p>
</div>
</body>
</html>`).window.document
    const target = doc.getElementById('tag')
    it('should find', () => {
      expect(target).not.toBeNull()
      const res = findTag(target!)
      expect(res).toEqual('whalebird')
    })
  })

  describe('Mastodon', () => {
    const doc = new JSDOM(`<html><head></head><body>
<div class="toot">
<p>
I released Whalebird version 2.4.1. In version 2.4.0, Whalebird supports streaming update of Pleroma. But it contains a bug, so it is resolved in version 2.4.1.  <br /><a href="https://github.com/h3poteto/whalebird-desktop/releases/tag/2.4.1">https://github.com/h3poteto/whalebird-desktop/releases/tag/2.4.1</a><br /><a id="tag" class="hashtag" href="https://pleroma.io/tag/whalebird">#<span>Whalebird</span></a>
</p>
</div>
</body>
</html>`).window.document
    const target = doc.getElementById('tag')
    it('should find', () => {
      expect(target).not.toBeNull()
      const res = findTag(target!)
      expect(res).toEqual('whalebird')
    })
  })
})

describe('findAccount', () => {
  describe('in Pleroma', () => {
    describe('from Mastodon', () => {
      const doc = new JSDOM(`<html><head></head><body>
<div class="toot">
<p><span><a href="https://social.mikutter.hachune.net/@h3_poteto">@<span id="user">h3_poteto</span></a></span> hogehoge</p>
</div>
</body>
</html>`).window.document
      const target = doc.getElementById('user')
      it('should find', () => {
        expect(target).not.toBeNull()
        const res = findAccount(target!)
        expect(res).not.toBeNull()
        expect(res!.username).toEqual('@h3_poteto')
        expect(res!.acct).toEqual('@h3_poteto@social.mikutter.hachune.net')
      })
    })

    describe('from Pleroma', () => {
      const doc = new JSDOM(`<html><head></head><body>
<div class="toot">
<p><span><a href="https://pleroma.io/users/h3poteto">@<span id="user">h3_poteto</span></a></span> hogehoge</p>
</div>
</body>
</html>`).window.document
      const target = doc.getElementById('user')
      it('should find', () => {
        expect(target).not.toBeNull()
        const res = findAccount(target!)
        expect(res).not.toBeNull()
        expect(res!.username).toEqual('@h3poteto')
        expect(res!.acct).toEqual('@h3poteto@pleroma.io')
      })
    })

    describe('toot link in Mastodon', () => {
      const doc = new JSDOM(`<html><head></head><body>
<div class="toot">
<p><span><a id="status" href="https://https://fedibird.com/@h3poteto/103040884240752891">https://fedibird.com/@h3poteto/103040884240752891</a></span> hogehoge</p>
</div>
</body>
</html>`).window.document
      const target = doc.getElementById('status')
      it('should not find', () => {
        expect(target).not.toBeNull()
        const res = findAccount(target!)
        expect(res).toBeNull()
      })
    })

    describe('toot link in Pleroma', () => {
      const doc = new JSDOM(`<html><head></head><body>
<div class="toot">
<p><span><a id="status" href="https://pleroma.io/notice/9pqtJ78TcXAytY51Wa">https://pleroma.io/notice/9pqtJ78TcXAytY51Wa</a></span> hogehoge</p>
</div>
</body>
</html>`).window.document
      const target = doc.getElementById('status')
      it('should not find', () => {
        expect(target).not.toBeNull()
        const res = findAccount(target!)
        expect(res).toBeNull()
      })
    })
  })
})
