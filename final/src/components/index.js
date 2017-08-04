import React, { Component } from 'react'
import '../bootstrap/css/bootstrap.min.css'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Dashboard from '../protected/Dashboard'
import { logout } from '../helpers/auth'
import { firebaseAuth } from '../config/constants'
import AppX from './App';
import Gallery from '../gallery/Gallery'
function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to='/login' />}
        // {{pathname: '/login', state: {from: props.location}}}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard' />}
    />
  )
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true,
  }
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <Link to="/" className="navbar-brand">React Router + Firebase Auth</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>
                  <Link to="/" className="navbar-brand">Home</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="navbar-brand">Dashboard</Link>
                </li>
                <li>
                  {this.state.authed
                    ? <button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          logout()
                        }}
                        className="navbar-brand">Logout</button>
                    : <span>
                        <Link to="/login" className="navbar-brand">Login</Link>
                        <Link to="/register" className="navbar-brand">Register</Link>
                      </span>}
                </li>
              </ul>
            </div>
          </nav>
          <div className="container">
            <div className="row">
              <Switch>
                <Route path='/' exact component={Home} />
                <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                <PublicRoute authed={this.state.authed} path='/register' component={Register} />
                <PrivateRoute authed={this.state.authed} path='/dashboard' component={Gallery} />
                <Route render={() => <center><div><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPEAAADRCAMAAAAquaQNAAABfVBMVEX///+53syukjEAAAD8+Lm53cu438yukTK74M7Ly8uuki+949AAAAPG7NqPlsrA5tTl5eX//8b//7/x8fG4mTLI7dtzc3P4+PjF7dleXl6YmJjd3d27u7vt7e3X19efn5+JiYlOTk57e3upqalCQkKx0cFkZGSysrIRERHBwcEvLy9tfnaBlowAAApra2tWVlaRqp+ghiqnjkC/sX6rmFmkwbRIU018gqtUX1ofJyMkJCQ8PDwbGxt8joaMo5ictamCbCNxdJyJkcOUlHoXFQxJQBRkcGleTRmTeyiGbiQ2PjrQxJSihB0+R0N0YR9ic2u3pW3Wy5uFdTaoihmhjUs3LBFpUxlLRkooIApNQhVDNxXV/eqfkWpjXkIUFx2fjVRqVA2Kf1E1Nj5QSxokHg/KpzU3NhMdEwojHglrXiE0LBPT1KNAQVY+Py61tJDs6rMfIClXWncuLkBrbFpOUGhjZ4ifnYB5eGXIxqBTVEYUHhlPUG2hquU5OS3//9MpfGNYAAAev0lEQVR4nOVdi1/bRraOPR1JSFYGEgkUAsEBlBjbCTYgxxhsk5SAgfDINskNyb29e9u0zatN02522yzdv33PmZFtyZZsbMBW955fCwQD1qfzfszRpUv90PTI7eTs3flSigCtr12bnVwY7esP/RlodCp5kwTSrdtXh31x508LyZJAlypmKrmqYwM5TjVXLrqgR4Z9hedJV29f46hKhzlbNy2LKUAxRVIUzdL1l6x6iK+u/cdgXhBwyZZtAtQYY9mqEnOJbhHyOcssVkVWX/tP0OjRpEBLSEGXACJTMuRzVXMBa1n+alWSFMvOwFfJYV/vWWlkkcN1LMtkOo3FJA1gzb+U6hxWmG1T3dQofm0pKNxTw77ms9DCGiDYrQCUGKUxihwu4x2wpYZQxxRFwhfFP3S7QMjin1a0RxBv0bGUhtKCFCPiXc83WkjSq/ADk8O+9L7o+jxc+iG1FGZptIGI6k62qkuhiGNUY6DypevDvvye6eosqi/gVZytdEXzIFK0cA4L4mxODhtBj3Qb5dlGU6VDMOloPkQ0BGnjVY2Bp0r/mdg8DaHkqmNxaAqtmkoQRgleakq3ojHGmty3/lzajAzOgq4KnIpEA5nKTNDZJmKnWCxnY/VbIGnKPhjtYSM5Jd2FcNFmPpTtkCWaSYO4N5iM5gruk+cW6GDV08PGchoaXSekbEodrDEHzHgg3UQsWVVQ+FwTsURRsueHDac7TSEOi8a6II7F7HVw1cwjBRpzbK+FozHLIWR22IC60SSwRdE0nXW2x8hDBVyX76cUpcVtUVYhZGHYkDoTqPCWpenl/XI75Baugxh0vSsxs0jWh42pIy2ijWaVMticahu/KAtG1YkkSsjtYaMKpwkIKyuWMLrrzM9SxSyTihaCK5yolYmwvZ4Ab1NlyBUgKvl4rGDq+1nvnckxm5Coxl4CML9Esm63yDTP+wN0uyuPY2Y6sqEXijSKMgOvo7X6JiUHKSKLdUshAohlyM1hQwsmLMraCiLVdVd6JUlnLkaFFjLBKWJwBOq5V1WSmhg2uCC6hcpbdMXWRSHRfdIQb4vRIMSUdbHgCmhJFCvZvHi31XLxepGkmnIcHHeyQqGzdqMljKDpgtCyRHJWK3ucQ9pFc7UMJA+d5VqPYtg1CgJt6u1XrrCu0TW1WecQXDKjGIOskVQf8ZSLqNstMdfJzLABttIMIa3+9/yIWruRK3lNQ2zRTzR1SsRmgYwPG2ILjRNidtXX/kkvkLvDhugnMFsVzetrpW7Fyh4RF6OGuJXFEtW6RRW9EI0c4gnCPaqnfGFVSeEcIZtRk+o5zAw13WkU4VkBs6RzAyxZ+xFDPE+KOpajGu1CViza52i6qbkaLcTgmqqawwuxrlxDbhDYguiTMOaKlHe6TYiCPXCSviCXjIiTw0bppVtkX7cK5FRRl6Lpvd8WzJ3mho3SSymw1BZp6x4GEDPtSmG/5+Ke4kRrTGIa9VdxMlTrXHzWTCfDK349B+BYL4pSfrwAaswbgR3DTKZkVxHubsZhWo9cZnCnolT1gbTJ7GaYGePs3apS3bLsrNObrzb3ydqwUXpplux2RIzBSUUMbFnMYpVVjxs7DVGJRcw53SLF1lqP74I1s5oGkJ8z1HLKBZTrSncb50PsRKwEskYy4QAUplfSfL7JdPiwKQRjTOstPEGNmB42Si+tk7ImeNHWOpQYRf1NZXWhx6Tg6JBV6XpPpstajVjfiQjEms38dT1KcfqSkP3qS5uzd7+ivGROJVPcX+2lGYPeOFpNGDG5odhk3aueVJLMCh+1fUk53oz9kuUK7ux4tgdjjbMTQxLq0ZG5ydlrN+dvLo5Pzt1oXESK8xg8CCEeHJTZuziuZ/Jhj0RWN23eYiXz5So1e5FqsNRD6DpNTyXXWmf8U+Ni9jvNLRdvoHqK8XqWjyfiJ/K5YloOsje9Va5UKuCUT4+YsuzAy/NXp8ZTLsj0fvGwnM1my5kCD6BKNy7hUMCWBjYLFbWRJDC6C1bZ0h200xXgL0rAVq7o/qHditmlC+FjcWmQcKfnxCmOfXCilFm6Dr4FCL6gOUQxghHIvkklfdcTMEPEseroio4CnWGMC3YZ+2WE3BGgU1XrdJBxMnmAzniBj4IXICrUmaKIPhkVHyjVLGcde36TIspkuVxdjfUMyZoSsz/DnQJGV7mpwvSq9NsY0IeffkeOdxq+bZJCBjf3MjED7FjPOLrFRyWVlsxIolQBiZvBFhvqL1XqgirZ+zaL8ciyoksWeKiMwiRMgD5c+YLT2DuQ9n12ilBT3wpMFCemp0ddOj/AMyiRDghx+OVQELnFS9d9Y3ZCFBVqwaXuUoZFvpTDIK+CGORXFzBi/gcfGOhGWExqRh/XR25PJu/Or/st6Pj5pFXAuGLVZFKnQrskacA3dMjF1rqGxPb5nGIMPhcFL61DL+Ivxr4ELlsd/z6QXhKZ8fXbs4utvqJBpXOAPDoPgmh1EToaUyyO+K7PESMpbBczJYrtk4w7laeUye9jX/ghH5qd3wE1Ijk9dy3lQ5jaLRS3DjNAh1tFNJ9nn2KcJKugiJ3vvsJMWs2UcEx0gbSMaUkAeJ1qFK84q0v82Ick5cimF/EXY7/inEz4O0jMrPqQrhbLOcfW+OGwBpnoAc6I90aJFPRw/uIrmsUQLRH3dwIuRm/eH4laRXDNEtfCsqkxx4GQg0pwaT7EX4yBybZDzITCmJPdr2NNF7OOrZu6pmHfg3qYQfHNyI2z4J0YB4OlhzexKcClFX4tqfcfhSFN4kBi8zdAu1GxFcjki6bmoEjuVy0cbfjgQ/zFB9DBAB8lQYrpHDYkuZSD0A2htrTy3OsxIZg7i8Geg7eo6sECDe4JHJJe5enA+08PTk4+ifrTVUDv+R1GdrklY0XCJNu97qIOkfdvV/yQ3/G720Kabpc9ips120+RKA2C23MmqR5BN0nD/BGaKp7vko/3Lp9cvnyvYTRmfdkQy3LrDGCrmrVLSh8g5lglJVomX7YgRuvVUgDS3DtKUijJto1JR2PaUeJnKXRGbUEUlDp7Bst1HQPKSkjnG9VS5+nA+3uA9vI/v0HAbokRNJl4ZE7cMsrAD4M/fQcwryC2WfKjX5EB8h8g1543YXqFm4fPZR74KN7JTkpB3E07d7jr9Uxb632r8fQ4hn5KCIPhzURN7uODk08A+D55j29YT2rmUGxbdQGEBcIOF+XYT/jz7tcfGgr9ztOEhLcQRza3HIgE2oYcNR3M5WcB9GevDe8vl5zA+TNsCAarsHtmlADYk48EED/4iG+abPw+iEeuta4BPklPk7+7knzlJ5Igv3GD9StJ15l95R+YgIgQReHHGRNlRW+Fi+VQWnHLCan39x+c3IdLefDgwWWwnf0V72c43rCSpKTzss3P95G5D8h7+MSVuAkYGxPEbu1JQLYBQu0NLFGRx+YBev0+oL3G4m/dQqxWAoYLpIZyo8G8zIlfDNz9RF9zTwvrmOSE5TLAX8T7y31Q3wepX77+Gt8Q762v+QVhyGpbBIWWuumRxkrkjzEReTS/feVLjEMsyo/FFJ2A6oikmRVhu/92HwwmQr5PUgj4053+Ai4IKfHwWUjMIQ5NEpCky/c4Zz/Crb33NeGpsZeSeJq6hclK1Rt1XHkngL7Dq29EnGPwD2eLi7MdZDUlt7z/HjECVgKfH9w7OXnwN/7t3mt+E7PcQIfGWAxb4e8vf/rnySe0WCfIaDRat9rC92tgclqaE37EqLQozWCggeq+GZkMtJtjYK3arYhV5dWWj64wc1OCyH/hvzXfu5nGo0mHLLyWirkCuXfyzS8nl4l4zwf/xLcKam6CM8/4KxutiL/klpvbMJJwXxj7TdjMtgl0jCY1pegazDpx5J+EUt/qHe/ELfBoTngxQtLgkn+Gd/gZjOM9ZDHnL5kNzM8mSgjZGwqiO/YgRuaiIRvbxD/yD2Ty2DsIrjM0OMqjXMDIpxMXKKcTccsxqeoZ76URgsOFHbqgaHkA8GUQoV/wze5xWQrd5XB1vaWYo9C6ieIifOXvwlrjZ4KhyRVwVKRIQ3wEZVWuUSdgrPj9hiuoi/PNvjrok8BgGw/bhULGch0XJfCAyGkuSh3c31Wwqfve84qQPfyGEddPP3HIY2viDnzgV/3jv77kJb6wvJTH5MDge4l7799z7oorIIuTfaUOE4vIkI5ZP5Y47ruydO+9EKXO74WHYdZtT4hdAKZ+QNsk3PJYmhtpjDtQl3meEPr2WABBDb739UdAe19cAJnrt+IxCr9cNTun/RAx/SLMxUchSt3LqBMYm+esutHVsuSPf3H/+7swzR9K5MuxOpMh/ejQf8L7/f5EqO5HN6xMTfZd4QEVTodl400OgZkGif4b9/+Lc6ezFOjtivV6ILZ+Pwj385vQ5w/cL/0LE+yszjpNjugFrlIgy/XccfwMC3Buw1VZ3erFrFF0SScXTn9v8XQ55NiivM1S5KcxDI14uOVar3fv/hDyTKXwQxQ4GQAsvveNy93ZM+37AZtVtjoOBEOmovBEJn13ZqRHSRrF1kuBr0zAOeHfweMm6lkEqHKKpDBh6la6xSGuT/e/Fo536oxl6aQ4a9fh3ZjYKTQ70t8xo0m8zC2qSxSV8YOIpEtuqriJLzHa7RyuJqon3L6VbianzlKiBU2zOwCmkCphHrN2ho7eKF/UtGVbeN0/XRGGinuoD7+T3dCkpXnLJWaViZ/G+z7kNU5SthJ+fNCtdCyeqT4IphG3vZBC9WUJgqsrvByQGuMhZbazS3SrS1msdKSLmWwlV6lkM7wr2eclzWIpObQX4A7mnBUv0g3eRUhxDzz2I379d0iRVzuJF78CZjKeDR9WFZ3xTqamMcYHDvrSZgAc3uFSzByWmc5rDdropGgR1R3wehqyq04CTYG5lS1MllYrui9/pRLG2P1sjZglpdBDZppVXT9HvJxuTKa5Ars5YSVcgxVcDOFOTuxWcYrANzsE1iXbj1wnyXrrMobm7eXyXDr3IddJzmSeFDsdR90sKvDuO0GaLlG9j/w/6RvV8PPX4UXRixhjXiO/jvFWYqfObEx3+Vu0zWDHRa0CudXjW98FoxX41yS+9oxc0OHABZDrH4O6Dx40us0LXejQWgf6GpURliHXenpjCIUC2vIKv7280pC8qIleXnR3QgHTGIsJ/h7arfIsaZpZNzynRjx9+27qFi/QBh8tFJN1JHlhp7ivl/AkdljpP+aO9onZCd+dwFC3mvnsjn1Kpzr1NDGSbMwQ7AZ6QnfyefzipuKw0lINTVuoZolGRFnzXh6FqEt3yphileqjgF0t18SNGT6ZlDreeIMGP8gTMr7kj9y9wMWFcxB5MS1wgYDYVMRlPuvJLLCfxixnC8Osz+W6oEt4oircOwFvBdpnO7JhqCr2SNptFhNrHG9d5KJGcA+5kKgDkLi1Sr/MU2byAjZZzdpmYzKZ2aGrukZvz6JjJa+f1VRAGwcy3roTwU2SFCb6PJ3qVmena2Q/dJcPlSyRgad81UDdLqMmpstNuKDRJpaR22MjEORrXG/fPqvJRjwux2UZEasHbUscXHMxfqF4p0uQ+IeF8FTTOScz+xAHCpZTCeJ61N0UCLPwKwr/JuVj6S1aPL3gDou+fgNojTgnNc55HN8hBU/tHFetCrwXu3h0gRTClzVRZiNzUrZlpkma8dVVkDLhtzKO1ch1QKPtrOgYe6psEzfm7gp7/HobJBlgynEfqTVPGwyshejjzV7wVpGZDt0dScz04bAXxWrHvk4lMY9crIryF9/BiPY6LaDN1r1JY+P3nafbO4K3aryN8u6RaDyYZInw5uL8bwNwhyhL0bnJwm2LEGWAUSryQftUVqlv2FAU3axuuUW9+TlxtTdmbglvu31QyxuANgArJzlOCPfu1G2N9l/1PTWN4FuGqjCX6HWbqxrEXGCW0nw9riYyJkWzlJy7tpysz4ziOLtrkLlF/g78jyoDhSFWZX42mCoifl4bxPhuqcOZa2GjGzVeCKdAzcq0nhHj/BReZ4IXuRLrNxujP3cS2zXX/3QmROwoksnrOdcGsvZ8qm10sUkmd4s571SmniYF0YoF3W0cpyDf7jy7U/+aJL5/89vS0l7+FIABMgZ6Dp9hHNBe6HQIi8FQmWigCopvih57THhARhNVRWTuD2+QnYaR33hKyKu/7oDeykvy0t4jDkjF/9W4rKrNT+J7Kv8APC6CiU8P7BQvaHFwz5LysVxeLvfZcRzzcSy96k4mPj0AgHE5/+RoRVa/e/XN/62srORV+QkifrIUV58syfmVoyeymocX8OsV/lldWll5kseP/4uV7j4azH3TGskEshgSBLQ/7ScdqbVP1stieOnFjhs+qct7K8vLam128ejx0dFe/tFjkOpHyyuquryS3zuC1x4tLx8dPcnvLfMfWFKfHB0tL391tHz037OlgBDt4mgquNgCUiuWDmYDckcmlBVNk2uC1aXHtXztsfw/d4n6OA9IH+01Ea8sP1Lzj2t7S3ng6d4jeOmroyNVzS892csfHX11sDg/SMATkNwH+mK30RC0RJLy5QvHKMv1+AkQ7wEtfXPrr/nHeXX5yIsY4cG/V+AHVuCbeWDwEbB8b3kZERvbNwd6nDV4kxONieMwxWAeU/TKx4Y3YAQePnr01bP5a484YpfHwEFAvbKHPM5/9eirJ8t1xEf5x4++ynPEr24OdL8VKGrQ4R7BYbtM2jI5ThLubj425CZi9QhYdkT+a9xweYx6nF9CPq6gBu8dwcflvaMmj/fgtceImCwOctcCGOpcK4ulBmBsKAWe36X8INy2oTYcLpjipaW/kDt/ictoh5fUJVleAtYvLYFkP1paWVLlJSD4KMfxvyX8+SVwYUv5we5amA2MPsSmVFvTwhBjSRogH/i4rBoPScLgyQJ6WvwggyPCOMTrgOs/UP/3zmB3Lay3H46JidFvPCWAiA/D4jEUgDeGJxuSjQQ58EZZEFyAPC8B8NA0AmTj2UB3LUwH2GLww6sCMA+5imHzH/zYw1NVbaCRQT59aGovDBFedSLjxUB3LVxv3+MsKUqaA1Z40tBp84COd2bHaLD0AO23h8U10pr9ByHe7Ll9cRaaavNNUowJwPwIE4S7hdBzmlScrNgGt6y63Kr5wORJrStiWe1vCLlfmmtHjCe+uEjrGYIFiUDn5RJG2AnyAiBznhJi+NCo5CA0K278zIBNdTviOmA8targQbX1DhtEJHOXfHtMngugO2i7fQKbeNg9Qa4N1lS3IFYkfc0FrGXXmHjyT6fjexiZxY9JQgYvZRyTvA+wbDzdNLqJNSj/mc5A9Uotekz5igE+LqcfWlJMw5Jex1EB65C8/m6bJPKGbJA7fqGOG9ukm6XG+zTQZcgjPsTc35AMN84Sw8oi8rhT65ynUQfGBiE1o+a31IJ/tWCcdSngpnqgG0RGfce2RCfvVl2MJVHyCZlUcAnFQAW0ZGebbLQytOaPSNpFGj3YYDeITHiPYKNSZrb4OgEFHzMoRhFCT2i6pK9jfJ2/A0Y734ooj66rE2LZ+GHQG77XPdmgUs04FmfzYc7hx00Tr0nX5U143CAPifLbusn2AFLbv+eVabB23w98Ld+4N27WNLF2sEEH390JTpC9BB4Kosm4UWstSQOgOyQUMaYSxlsy8HVec57NIEigysdvNkVRJ5F4sfOi++Qvjinng8NJiMLyYTGIrBr5BCGlQW+tv9GSLbIimF4jX9up5ePkqfwcoXcezaS4NedFcKRhBFizBo+NN9iBGPyKuhaHbO2SHRUZgK2CtwZcsvepToGk4DGaNqMlUB2QNwHcl8FLGztYz08OHC+uZfPty7BSpOZWJ2UwO7KxmQgp7nrE2iyQp4H6Cr7nbVDUBe4MbWJ6gDXqJs0BIE/gzJrsypPXRhxFb73botAwJsvYKEXEvCKA/4FxA3umHnBLMaRNoqO+9Yp46slVPMjvwbVgatN9n6iOmhxkuyCdkvksAAgyn4JQDaP2kBvGoW0uW/ApMnLLlU+5hohl43nQCW2/VAtzHYQYYsgaWmUjf7CdR7j5bd6EHFyPqY2uku+9dR8pR14JxCqEiKicKsTMpOvuJvDJ20FGGdzTgaHuHKd4saS2LXqts0PRX5dGSA2PttWvHNLDh3UbtIOpPjCZdLddXDYCEW+Tt9+74Yz4vDY5TLiX0HCB4NV3Vyk4M/umzuMDHhTL3G12fVgfMPlAjbcJNma/TRqfuTH8DbFJAoLXOGRPTYgsRW1SVQ/cNEDFQLvbQkWtyu1cG2JIja6Nz0yNTM2mIrLXGhA/I419GWiqa27IAAIpUj0VmWx3Xg5M0a0FuGQs6Ebs8e5JAqZpi6yKGTSp2rC5svFtHbFBAk7htxJLEbndWqvxqC3QBMT5Gsk4YuUYhTwiUferIO1uTMyVsdrZJ+OON7U9oJQHXI0+Bc2Qmkz2X+bIqoIV6nQzXDSe8gibf/k64Y5chRJ65IAYRIa/Eq21sOCd3oDQMqvCz4LYpG6q4VpfNYtUGHh1DkP0rbYql/gzg+0qnYImyNvvNsEuYQs8g6uGag3u3GnGyty65UIHc8X8T00OkOr4xhlXcp0/LRL5mOQUyuwCwcKW0UDsrVsZrxJY8ArruaE7DqzvyOieIrXQGo8gf7tBMppEFR0Hwb9tKKOMSYBLKnfK66GRF04MBLaYIFeK2PMl+Iqyb8kqxpkSTpw2VBc9qYdrxgYEmwUz8HGL/FnPIVUQCFJ7PAd08bSIU3cYgVCbJDxdEz/iOK+GZIIWRonNGGqAN+a/t3nmbYLnTVOIGNMnZLGnKlUjd75r/EOFjO8pDne1NxrFMp98e0yNDIbw5ThyiHEpGw7moUfd9HB1h/zgt0VGKpEguVbIinkIt6wWWMs0XhjyoDtpp6Fx3nhQsMm202QxBJ8vfIhBanGkuOWMv4X7FxP5gHCLh6c1Fe5c1CJrLOAmyC4uX3jqjZoO2nJ8FevLzQ0ioPti5v1VWEna+B5uWj5y7gk7MWIc3Gd9IGN61opYruFPlk2xu0lhMd7AeBbeFd8gMh7gilgugbH1ZhwLFLXGlau8QdLeF8QeYgLP3OFjFxx+huN1rcMYgAq3A2K3sy+7PWe6it3f/I5n4F028s/vAOL2DD+/yQWimBEnI1IbRodxHhXyLwNuXT8n7C+WZslr0GB+5by4bKjHCGejvaYBTmq7WcV5JfCGQQaXtkE2wD0NdDn9qWiCh0x48QjRkBHU7GRIy8jIu5iPO8lzHTT54bs3UcuekK6DfO7EDSR55yEe4rkKjA9EDAkSduLwCFP4gZ7m7XlIajsRe1SMoFEc8Xn+4uELbAfd5Btkboa1BT32vBvguLpDXqjRC0E4Lbir1Ev1pWkkvBF6esJEIh/Fp14Lun5jpPlAlasYgZ0Zsmo8I282o/V0vjC6cS6IZTVPNjejF4IE0QgJSQ96Qywb30M0HqkHmYXRbcwAz67IfO4ycjWBQJokQRX33gkr1sN4BFLvNBvYVekDMSbIkXogYRilydtzQcwdVASDrnYiXQYMT008Eo9YyTqIRn0FkbNRPoIZcjuNkIR6LqY6zjtYqWHj6U4zLVWuM1EteqWudrrVZTK6F8Km3eKwAXWlUpfp954Q47xQlB6KHETTLafTzkQq9imjHmgukO6nWE5NMp91jGSO3KQkeRNavuoHs0pOsZNtqLR2HomTBzFGIZFm8kTgUEf/pGI3OtIJ1EJzVvGcECOTo2yuk+dR4/ITMDnKPrlEzlOmOeBo5xPXzytT9EJWo1wYSJ4txBTtnJbdAXyGN7JMDhmIPzVgWQ3oz+C4VHLYyELodk8BF/4kNp7xCDJuyDDU2s7GwQFurPLClg01gm1Vl9Ig1N1bSnVS6x+xaVU7ON6sdx43t3dU3spS1Xg+v3OciOCwgKARPABw6jqmylHJtZ2D4+cJEkAJ0vh2VLOJxW7FAFRUWeZI87WNN8fPm9vmUrvFTKXqUItWM8X9Vd+DchejWhWARHGnM1NRfuO1jWcPnzfhrBYOs1UbH5/O8BmxVJEYPkhdsW2nWqmkyLWpQZ/IPD3NkZa9JcBQtb6jFtnql9/dLXzuL9MtRMqf1+qdycV9Kopm7kbXL10KEmqEjAYov/HsRUN80yC+gNQymXjubyfSdyNd50qRA354lMcQqvA3iLVug/cPgakUZJbxx/52PfwVecSgxrizFd2T6vc3u1ugqYqpM+Z7KuwpyIo64u2D1OZ2Xq5tbL912ZoBrpomMlWS6KnY6ke8H2XElyYXv/a4lP1MBcwS7o4IfyheN5Iijlg8SjaVrTqOraC2dnu6U3diUUc8ic8Y1fiDuM+Fos9jQkpmyAMH+iNWiDbiKdwD8/8K8Twh3RYH9EaSFW3E10n3A9b/WYiThNjnCjjyUo3HRM5TiXHVV6QRjxD/SpRzQVyMMuLxDkvp+6VoIz53uxXjZ8eii3gkcJ31GcmKMuJkx42g/VG09fj87ZY49BpZxNe77Qvoi6LM40n/7qrzITo8Hv8bP6Prx1pitC0AAAAASUVORK5CYII="/>
                <h2>Ummm...*awkard* This page doesn't exist. </h2></div></center>} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
