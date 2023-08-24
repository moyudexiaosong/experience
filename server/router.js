import express from "express";
import sqlFn from "./mysql/index.js";
import jwt from "jsonwebtoken";
import config from "./config.js";
import url from "url";
const router = express.Router();

//这个是服务器，因此是发送响应的
//登录接口
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "select * from user where `username`=? and `password`=?";
  const arr = [username, password];
  sqlFn(sql, arr, (result) => {
    if (result.length > 0) {
      const token = jwt.sign(
        {
          id: result[0].id,
          username: result[0].username,
        },
        config.jwtSecret
      );
      res.send(token);
    } else {
      res.status(401).json({
        errors: "用户名密码错误",
      });
    }
  });
  console.log("okok");
});
//暴露router模块，export default是commonJS的规范
router.post("/register", (req, res) => {
  const { username, password, email } = req.body;
  const sql = "insert into user values(null,?,?,?)";
  const arr = [username, password, email];
  sqlFn(sql, arr, (result) => {
    if (result.affectedRows > 0) {
      res.send({
        msg: "注册成功",
        status: 200,
      });
    } else {
      res.status(401).json({
        errors: "该用户名已被注册",
      });
    }
  });
});

//商品管理分页查询接口
//前端开发的时候写的接口肯定都是假的，后端把真接口写好之后前端再一一改过来，这就叫连桥，就是对接口
router.get("/item/selectItem", (req, res) => {
  const rate = url.parse(req.url, true).query.rate || "简单";
  const sql = "select * from question where rate = ?;";
  sqlFn(sql, rate, (result) => {
    if (result.length > 0) {
      //直接回消息不好，一般会给一个数据结构
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "没有数据",
      });
    }
  });
});
router.post("/item/addrecord", (req, res) => {
  const { rate, question, answer } = req.body;
  const sql = "insert into question values(?,?,?,null)";
  let arr = [rate, question, answer];
  sqlFn(sql, arr, (result) => {
    if (result.affectedRows > 0) {
      res.send({
        msg: "插入成功",
        status: 200,
      });
    } else {
      res.status(401).json({
        errors: "该题目已存在",
      });
    }
  });
});
//DELETE FROM `question` WHERE `question`.`id` = 102
router.post("/item/deleterecord", (req, res) => {
  console.log(req.params);
  const { id } = req.body;
  const sql = "delete from question where id = ?";
  sqlFn(sql, id, (result) => {
    if (result.affectedRows > 0) {
      res.send({
        msg: "删除成功",
        status: 200,
      });
    } else {
      res.status(401).json({
        errors: "删除失败",
      });
    }
  });
});

router.get("/item/keywords", (req, res) => {
  const keyword = url.parse(req.url, true).query.word;
  const pattern = "%" + keyword + "%";
  const sql = "select * from question where question like ? or answer like ?";
  sqlFn(sql, [pattern, pattern], (result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "没有数据",
      });
    }
  });
});

export default router;
