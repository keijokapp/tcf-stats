"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _config = _interopRequireDefault(require("./config"));

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildUrl(metadata, mutation) {
  const tokens = [];
  const world = mutation.world || metadata.world || '';

  if (world) {
    tokens.push(world);
  }

  const skill = mutation.skill || metadata.skill || '';

  if (skill) {
    tokens.push(skill);
  }

  const period = mutation.period || metadata.period || '';

  if (period) {
    tokens.push(period);
  }

  return tokens.join('/');
}

function prependZero(value) {
  return ('0' + value).slice(-2);
}

function Home(props) {
  return _react.default.createElement("div", {
    className: "container"
  }, _react.default.createElement("h2", null, "..."), _react.default.createElement("div", {
    style: {
      margin: 'auto',
      textAlign: 'center'
    }
  }, _react.default.createElement("table", {
    style: {
      margin: 'auto',
      width: '88%',
      textAlign: 'center'
    }
  }, _react.default.createElement("tr", null, _react.default.createElement("td", null, _react.default.createElement("p", null, _react.default.createElement("b", null, "Eelmine/\xFCleeelmine p\xE4ev"), _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/1", _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/2", _react.default.createElement("br", null)), _react.default.createElement("p", null, _react.default.createElement("b", null, "Selle kuu/n\xE4dala algusest t\xE4naseni"), _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/0m", _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/0w", _react.default.createElement("br", null)), _react.default.createElement("p", null, _react.default.createElement("b", null, "Eelmine kuu/n\xE4dal"), _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/1m", _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/1w", _react.default.createElement("br", null)), _react.default.createElement("p", null, _react.default.createElement("b", null, "\xDCleeelmine kuu/n\xE4dal"), _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/2m", _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/2w", _react.default.createElement("br", null)), _react.default.createElement("p", null, _react.default.createElement("b", null, "Vastava kuu/n\xE4dala algusest p\xE4evani"), _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/", _react.default.createElement("i", null, "kuup\xE4ev"), "m", _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/", _react.default.createElement("i", null, "kuup\xE4ev"), "w", _react.default.createElement("br", null)), _react.default.createElement("p", null, _react.default.createElement("b", null, "Kuup\xE4evast t\xE4naseni"), _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/", _react.default.createElement("i", null, "kuup\xE4ev"), "t", _react.default.createElement("br", null), _react.default.createElement("b", null, "Kuup\xE4evast kuup\xE4evani"), _react.default.createElement("br", null), "/", _react.default.createElement("i", null, "maailm"), "/", _react.default.createElement("i", null, "kuup\xE4ev"), "-", _react.default.createElement("i", null, "kuup\xE4ev"), _react.default.createElement("br", null)), "Kuup\xE4evad peavad olema kujul d.m.yyyy", _react.default.createElement("br", null), _react.default.createElement("i", null, "maailm"), " saab olla \xFCks j\xE4rgnevatest:", _react.default.createElement("br", null), " valge, white, sinine, blue, roheline, world1, green, must, world2, black"), _react.default.createElement("td", null, _react.default.createElement("b", null, "Skillid"), _react.default.createElement("br", null), "Soovi korral tuleb oskuse eestikeelne nimetus", _react.default.createElement("br", null), "kirjutada argumendina ", _react.default.createElement("i", null, "maailm"), " ja ", _react.default.createElement("i", null, "periood"), "vahele.", _react.default.createElement("br", null), _react.default.createElement("br", null), _react.default.createElement("b", null, "Nimetusena sobivad ka oskuste omastavad", _react.default.createElement("br", null), "k\xE4\xE4nded, oskuste ID\xB4d ning tuntud l\xFChendid:"), _react.default.createElement("br", null), "jm, jook, kt, rt, rk, vp, sepp, kaevur")))));
}

function MetaData(props) {
  const startTime = props.stats.startTime !== null ? new Date(props.stats.startTime) : props.period.startTime;
  const endTime = props.stats.endTime !== null ? new Date(props.stats.endTime) : props.period.endTime;
  return _react.default.createElement("div", {
    id: "andmed",
    className: "container"
  }, _react.default.createElement("h2", null, "Info"), _react.default.createElement("ul", null, _react.default.createElement("li", null, _react.default.createElement("strong", null, "Algus:"), " ", _react.default.createElement("span", {
    style: {
      color: props.stats.startTime === null ? 'red' : ''
    }
  }, `${startTime.getDate()}.${prependZero(startTime.getMonth() + 1)}.${startTime.getFullYear()} ${prependZero(startTime.getHours())}:${prependZero(startTime.getMinutes())}`)), _react.default.createElement("li", null, _react.default.createElement("strong", null, "L\xF5pp:"), " ", _react.default.createElement("span", {
    style: {
      color: props.stats.endTime === null ? 'red' : ''
    }
  }, `${endTime.getDate()}.${prependZero(endTime.getMonth() + 1)}.${endTime.getFullYear()} ${prependZero(endTime.getHours())}:${prependZero(endTime.getMinutes())}`)), props.stats.newUsers && _react.default.createElement("li", null, _react.default.createElement("strong", null, "Uusi kasutajaid:"), " ", _react.default.createElement("span", null, props.stats.newUsers.length)), props.stats.changedUsers && _react.default.createElement("li", null, _react.default.createElement("strong", null, "Arenenud kasutajaid:"), _react.default.createElement("span", null, props.stats.changedUsers.length))));
}

function SkillMenu(props) {
  const skill = _common.skillId[props.metadata.skill];
  const menuItems = [];

  for (const id in _common.skillName) {
    const name = _common.skillName[id];
    menuItems.push(_react.default.createElement("li", {
      key: id,
      style: {
        fontWeight: skill.toString() === id ? 'bold' : ''
      }
    }, "\xBB ", _react.default.createElement("a", {
      href: buildUrl(props.metadata, {
        skill: name
      })
    }, " ", name.charAt(0).toUpperCase() + name.slice(1))));
  }

  return _react.default.createElement("div", {
    id: "uuendus",
    className: "container"
  }, _react.default.createElement("h2", null, "Oskused"), _react.default.createElement("ul", null, menuItems));
}

function NewUsers(props) {
  const world = _common.worldId[props.metadata.world];
  const numberOfColumns = props.newUsers.length >= 8 ? 2 : 1;
  const numberOfRows = Math.ceil(props.newUsers.length / numberOfColumns);

  function column(columnIndex) {
    const rows = [];

    for (let i = columnIndex * numberOfRows; i < columnIndex * numberOfRows + numberOfRows; i++) {
      const user = props.users[props.newUsers[i]];

      if (user) {
        rows.push(_react.default.createElement("tr", {
          key: i
        }, _react.default.createElement("td", {
          className: "number"
        }, _react.default.createElement("b", null, i + 1)), _react.default.createElement("td", {
          className: "number"
        }, user.rank + '.'), _react.default.createElement("td", null, _react.default.createElement("a", {
          href: `http://www.crime.ee/index.php?a=11&m=${world}&k=${encodeURIComponent(user.user)}`,
          target: "blank"
        }, user.user)), _react.default.createElement("td", {
          className: "number"
        }, _react.default.createElement("b", null, user.value))));
      }
    }

    return _react.default.createElement("table", null, _react.default.createElement("thead", null, _react.default.createElement("tr", {
      className: "tume",
      style: {
        fontWeight: 'bold'
      }
    }, _react.default.createElement("td", {
      className: "number"
    }, "\xA0"), _react.default.createElement("td", {
      className: "number"
    }, "Koht edetabelis"), _react.default.createElement("td", null, "Kasutajanimi"), _react.default.createElement("td", {
      className: "number"
    }, "Kuulsus"))), _react.default.createElement("tbody", null, _react.default.createElement("tr", null, rows)));
  }

  return _react.default.createElement("div", {
    style: {
      margin: 'auto',
      display: 'flex',
      justifyContent: 'center'
    }
  }, column(0), numberOfColumns === 2 ? column(1) : undefined);
}

function FameDiff(props) {
  const world = _common.worldId[props.metadata.world];
  const rows = [];

  for (let i = 0; i < props.changedUsers.length; i++) {
    const user = props.users[props.changedUsers[i]];
    rows.push(_react.default.createElement("tr", {
      key: i
    }, _react.default.createElement("td", {
      className: "number"
    }, _react.default.createElement("b", null, i + 1)), _react.default.createElement("td", {
      className: "number"
    }, user.rank + '.'), _react.default.createElement("td", null, _react.default.createElement("a", {
      href: `http://www.crime.ee/index.php?a=11&m=${world}&k=${encodeURIComponent(user.user)}`,
      target: "blank"
    }, user.user)), _react.default.createElement("td", {
      className: "number"
    }, _react.default.createElement("b", null, user.value)), _react.default.createElement("td", {
      className: "number",
      style: {
        color: user.normalizedRankDiff > 0 ? 'green' : user.normalizedRankDiff < 0 ? 'red' : undefined
      }
    }, _react.default.createElement("b", null, user.normalizedRankDiff), " (", user.rankDiff, ")"), _react.default.createElement("td", {
      className: "number"
    }, _react.default.createElement("b", null, user.valueDiff))));
  }

  return _react.default.createElement("table", {
    className: "container",
    style: {
      margin: '2px'
    }
  }, _react.default.createElement("thead", null, _react.default.createElement("tr", null, _react.default.createElement("th", {
    colSpan: "6"
  }, props.caption)), _react.default.createElement("tr", {
    className: "tume",
    style: {
      fontWeight: 'bold'
    }
  }, _react.default.createElement("td", {
    className: "number"
  }, ".."), _react.default.createElement("td", {
    className: "number"
  }, "Koht edetabelis"), _react.default.createElement("td", null, "Kasutajanimi"), _react.default.createElement("td", {
    className: "number"
  }, "Kuulsus"), _react.default.createElement("td", {
    className: "number"
  }, "Koha muutus"), _react.default.createElement("td", {
    className: "number"
  }, "Kuulsuse muutus"))), _react.default.createElement("tbody", null, _react.default.createElement("tr", null, rows)));
}

function SkillDiff(props) {
  const world = _common.worldId[props.metadata.world];
  const rows = [];

  for (let i = 0; i < props.changedUsers.length; i++) {
    const user = props.users[props.changedUsers[i]];
    rows.push(_react.default.createElement("tr", {
      key: i
    }, _react.default.createElement("td", {
      className: "number"
    }, _react.default.createElement("b", null, i + 1)), _react.default.createElement("td", {
      className: "number"
    }, user.rank + '.'), _react.default.createElement("td", null, _react.default.createElement("a", {
      href: `http://www.crime.ee/index.php?a=11&m=${world}&k=${encodeURIComponent(user.user)}`,
      target: "blank"
    }, user.user)), _react.default.createElement("td", {
      className: "number"
    }, _react.default.createElement("b", null, user.value)), _react.default.createElement("td", {
      className: "number",
      style: {
        color: user.normalizedRankDiff > 0 ? 'green' : user.normalizedRankDiff < 0 ? 'red' : undefined
      }
    }, _react.default.createElement("b", null, user.normalizedRankDiff), " (", user.rankDiff, ")"), _react.default.createElement("td", {
      className: "number"
    }, _react.default.createElement("b", null, props.user.valueDiff.toFixed(props.metadata.skill === 'kaklemine' ? 2 : 0))), props.metadata.skill !== 'kaklemine' && _react.default.createElement("td", {
      className: "number"
    }, _react.default.createElement("b", null, (0, _common.calculateFame)({
      [props.metadata.skill]: user.value
    }) - (0, _common.calculateFame)({
      [props.metadata.skill]: user.value - user.valueDiff
    })))));
  }

  return _react.default.createElement("table", null, _react.default.createElement("thead", null, _react.default.createElement("tr", {
    className: "tume",
    style: {
      fontWeight: 'bold'
    }
  }, _react.default.createElement("td", {
    className: "number"
  }, ".."), _react.default.createElement("td", {
    className: "number"
  }, "Koht edetabelis"), _react.default.createElement("td", null, "Kasutajanimi"), _react.default.createElement("td", {
    className: "number"
  }, "Level"), _react.default.createElement("td", {
    className: "number"
  }, "Koha muutus"), _react.default.createElement("td", {
    className: "number"
  }, "Leveli muutus"), props.metadata.skill !== 'kaklemine' && _react.default.createElement("td", {
    className: "number"
  }, "Kuulsuse muutus"))), _react.default.createElement("tbody", null, _react.default.createElement("tr", null, rows)));
}

function Index(props) {
  const world = _common.worldId[props.metadata.world];
  return _react.default.createElement("html", null, _react.default.createElement("head", null, _react.default.createElement("meta", {
    charSet: "utf-8"
  }), _react.default.createElement("title", null, "Kuulsuse muutumise statistika"), _react.default.createElement("base", {
    href: _config.default.appUrl + '/'
  }), _react.default.createElement("link", {
    rel: "icon",
    href: "http://crime.ee/favicon.ico"
  }), _react.default.createElement("link", {
    rel: "stylesheet",
    href: "http://valge.crime.ee/css/layout/wide.css?2.7"
  }), _react.default.createElement("link", {
    rel: "stylesheet",
    href: "http://valge.crime.ee/css/colors/crime.css?2.7"
  }), _react.default.createElement("link", {
    rel: "stylesheet",
    href: "http://valge.crime.ee/css/fonts/default.css?2.7"
  }), _react.default.createElement("style", null, `
			td,th{vertical-align:top}
			td.number{text-align:right}
			.tume td, .tstyle th {font-size:0.73em} /* ugly things are ugly */
			#uuendus ul {margin:10px 20px}
			.tume td {
			background-color: #8e603f;
			background-image: url(http://crime.ee/pic/cont-head-gradient.png);
			background-size: 100% 100%;
		}`)), _react.default.createElement("body", null, _react.default.createElement("div", {
    id: "wrap"
  }, _react.default.createElement("div", {
    id: "header"
  }, _react.default.createElement("p", null, world ? `${_common.worldName[world]} maailm` : ''), _react.default.createElement("ul", {
    style: {
      top: '4px'
    }
  }, _react.default.createElement("li", {
    style: {
      backgroundColor: 'white'
    }
  }, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      world: 'valge'
    })
  }, "Valge maailm")), _react.default.createElement("li", {
    style: {
      backgroundColor: 'blue'
    }
  }, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      world: 'sinine'
    })
  }, "Sinine maailm")), _react.default.createElement("li", {
    style: {
      backgroundColor: 'green'
    }
  }, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      world: 'roheline'
    })
  }, "Roheline maailm")), _react.default.createElement("li", {
    style: {
      backgroundColor: 'black'
    }
  }, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      world: 'must'
    })
  }, "Must maailm"))), _react.default.createElement("ul", null, _react.default.createElement("li", null, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      period: '1m'
    })
  }, "Eelmine kuu")), _react.default.createElement("li", null, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      period: '0m'
    })
  }, "See kuu")), _react.default.createElement("li", null, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      period: '1w'
    })
  }, "Eelmine n\xE4dal")), _react.default.createElement("li", null, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      period: '0w'
    })
  }, "See n\xE4dal")), _react.default.createElement("li", null, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      period: '1d'
    })
  }, "\xDCleeile")), _react.default.createElement("li", {
    className: "icon special"
  }, _react.default.createElement("a", {
    href: buildUrl(props.metadata, {
      period: '0d'
    })
  }, "Eile")))), _react.default.createElement("div", {
    id: "info"
  }, "\xA0"), Array.isArray(props.children) ? props.children[0] : props.children), Array.isArray(props.children) ? props.children[1] : undefined));
}

function _default(metadata, period, stats) {
  if ('world' in metadata) {
    if (stats.startTime === null || stats.endTime === null) {
      return (0, _server.renderToString)(_react.default.createElement(Index, {
        metadata: metadata
      }, _react.default.createElement("div", null, _react.default.createElement("div", {
        id: "sisu"
      }, _react.default.createElement("div", {
        className: "container"
      }, _react.default.createElement("h2", null, "Tabelid selle perioodi jaoks puuduvad"), _react.default.createElement("div", {
        style: {
          width: '300px',
          margin: 'auto',
          textAlign: 'center'
        }
      }, "That's it"))), _react.default.createElement(MetaData, {
        metadata: metadata,
        period: period,
        stats: stats
      }), _react.default.createElement(SkillMenu, {
        metadata: metadata
      }))));
    }

    const skill = _common.skillId[metadata.skill];
    const {
      users,
      changedUsers,
      newUsers
    } = stats;

    const comparator = (v1, v2) => users[v2].valueDiff - users[v1].valueDiff || users[v1].rank - users[v2].rank;

    if (skill === 0) {
      let millionIndex, halfMillionIndex;

      for (millionIndex = 0; millionIndex < changedUsers.length && users[changedUsers[millionIndex]].value >= 1000000; millionIndex++);

      for (halfMillionIndex = millionIndex; halfMillionIndex < changedUsers.length && users[changedUsers[halfMillionIndex]].value >= 500000; halfMillionIndex++);

      const group3 = changedUsers.slice(0, millionIndex);
      const group2 = changedUsers.slice(millionIndex, halfMillionIndex);
      const group1 = changedUsers.slice(halfMillionIndex);
      group1.sort(comparator);
      group2.sort(comparator);
      group3.sort(comparator);
      return (0, _server.renderToString)(_react.default.createElement(Index, {
        metadata: metadata
      }, _react.default.createElement("div", null, _react.default.createElement("div", {
        id: "sisu"
      }, _react.default.createElement("div", {
        className: "container"
      }, _react.default.createElement("h2", null, "Uued kasutajad"), _react.default.createElement(NewUsers, {
        metadata: metadata,
        users: users,
        newUsers: newUsers
      }))), _react.default.createElement(MetaData, {
        metadata: metadata,
        period: period,
        stats: stats
      }), _react.default.createElement(SkillMenu, {
        metadata: metadata
      })), _react.default.createElement("div", {
        style: {
          clear: 'both',
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center'
        }
      }, _react.default.createElement(FameDiff, {
        metadata: metadata,
        caption: "Alla 500 000",
        users: users,
        changedUsers: group1
      }), _react.default.createElement(FameDiff, {
        metadata: metadata,
        caption: "500 000 - 999 999",
        users: users,
        changedUsers: group2
      }), _react.default.createElement(FameDiff, {
        metadata: metadata,
        caption: "1 000 000 v\xF5i rohkem",
        users: users,
        changedUsers: group3
      }))));
    } else {
      changedUsers.sort(comparator);
      return (0, _server.renderToString)(_react.default.createElement(Index, {
        metadata: metadata
      }, _react.default.createElement("div", null, _react.default.createElement("div", {
        id: "sisu"
      }, _react.default.createElement("div", {
        className: "container"
      }, _react.default.createElement("h2", null, _common.skillName[skill].charAt(0).toUpperCase() + _common.skillName[skill].slice(1)), _react.default.createElement(SkillDiff, {
        metadata: metadata,
        users: users,
        changedUsers: changedUsers
      }))), _react.default.createElement(MetaData, {
        metadata: metadata,
        period: period,
        stats: stats
      }), _react.default.createElement(SkillMenu, {
        metadata: metadata
      }))));
    }
  } else {
    return (0, _server.renderToString)(_react.default.createElement(Index, {
      metadata: metadata
    }, _react.default.createElement(Home, {
      metadata: metadata
    })));
  }
}

;