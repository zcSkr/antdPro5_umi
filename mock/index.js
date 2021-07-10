import mockjs from 'mockjs';
export default {
  'POST /mock/login': (req, res) => {
    if (req.body.account !== 'baba' && req.body.password !== '123456') {
      res.send({
        code: 888,
        data: null,
        msg: '账号或密码错误'
      })
    } else {
      res.send({
        code: 200,
        data: {
          user: {
            account: "baba",
            id: "zc",
            nickname: "萨诺斯",
            token: "token",
            userType: "admin",
          }
        },
        msg: '操作成功'
      })
    }
  },
  // GET 可忽略
  '/mock/demo': (req, res) => {
    res.send(mockjs.mock({
      code: 200,
      data: {
        pageNum: Number(req.query.pageNum) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        "total|20-100": 100,
        "list|10": [{
          "id|+1": 1,
          "roles": 2,
          "sort|+1": 1,
          "number|+1": 1,
          "price|1-1000": 1000,
          "state|1": [0, 1],
          "status|1": [0, 1, 2, 3],
          "img": "@image('120x120', '@color', '@cword')",
          "name": "@cname()",
          "roleNames": "@cname()",
          "nickname": "@cname()",
          "account": "@name()",
          "moduleName": "@cname()",
          "roleName": "@cname()",
          "moduleNames": "@cparagraph(2)",
          "url": "@url()",
          "requestUrl": "@url()",
          "createTime": "@datetime",
          "textArea": '@csentence()',
          "cascader": ['zhejiang', 'hanzhou', 'xihu'],
          "select|1": [0, 1, 2, 3],
          "content": '<p>' + '@cparagraph(2)' + '</p>',
          "content1": '<p>' + '@paragraph(2)' + '</p>',
          "imgs|1-3": [{
            "id|+1": 1,
            "src": "@image('120x120', '@color', '@cword')"
          }]
        }]
      },
      msg: '请求成功',
      otherData: null
    }))
  },

  'POST /mock/demo': { code: 200, data: null, msg: '请求成功' },
  'PUT /mock/demo': { code: 200, data: null, msg: '请求成功' },
  'DELETE /mock/demo': { code: 200, data: null, msg: '请求成功' },

  '/mock/moduleDemo': (req, res) => {
    res.send(mockjs.mock({
      code: 200,
      data: {
        pageNum: Number(req.query.pageNum) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        "total|20-100": 100,
        "modules|10": [{
          "id|+1": 1,
          "sort|+1": 1,
          "number|+1": 1,
          "price|1-1000": 1000,
          "state|1": [0, 1],
          "status|1": [0, 1, 2, 3],
          "img": "@image('120x120', '@color', '@cword')",
          "name": "@cname()",
          "moduleName": "@cname()",
          "roleName": "@cname()",
          "moduleNames": "@cparagraph(2)",
          "url": "@url()",
          "requestUrl": "@url()",
          "createTime": "@datetime",
          "textArea": '@csentence()',
          "cascader": ['zhejiang', 'hanzhou', 'xihu'],
          "select|1": [0, 1, 2, 3],
          "content": '<p>' + '@cparagraph(2)' + '</p>',
          "content1": '<p>' + '@paragraph(2)' + '</p>',
          "imgs|1-3": [{
            "id|+1": 1,
            "src": "@image('120x120', '@color', '@cword')"
          }],
          "sonModuleList|3": [{
            "id|+1": 1,
            "sort|+1": 1,
            "number|+1": 1,
            "price|1-1000": 1000,
            "state|1": [0, 1],
            "status|1": [0, 1, 2, 3],
            "img": "@image('120x120', '@color', '@cword')",
            "name": "@cname()",
            "moduleName": "@cname()",
            "roleName": "@cname()",
            "moduleNames": "@cparagraph(2)",
            "url": "@url()",
            "requestUrl": "@url()",
            "createTime": "@datetime",
            "textArea": '@csentence()',
            "cascader": ['zhejiang', 'hanzhou', 'xihu'],
            "select|1": [0, 1, 2, 3],
            "content": '<p>' + '@cparagraph(2)' + '</p>',
            "content1": '<p>' + '@paragraph(2)' + '</p>',
            "imgs|1-3": [{
              "id|+1": 1,
              "src": "@image('120x120', '@color', '@cword')"
            }]
          }]
        }]
      },
      msg: '请求成功',
      otherData: null
    }))
  },
}