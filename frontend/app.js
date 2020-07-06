import Navigo from 'navigo'

import { Home } from './views/home'
import { NotFound } from './views/errors'

import { ShortenerClient, URLReq } from './pb/url_service_grpc_web_pb'

const shortClient = new ShortenerClient('http://grpcbackend:8080')

const navRoot = window.location.origin + '/'

const router = new Navigo(navRoot, false)


router
    .on('/', Home)
    .on(/\/([a-zA-Z0-9]{3,6})\/?/, function (code) {
        console.log(code)
        let req = new URLReq()
        req.setUrlcode(code)
        shortClient.getURL(req, {}, (err, res) =>{
            if (err) {
                alert(err.message)
                return
            }
            if (res.getRedirecturl() == "") {
                return Home()
            } 
            return window.location.replace(res.getRedirecturl())
        })
    })
    .notFound(NotFound)
    .resolve()

export { router, shortClient }