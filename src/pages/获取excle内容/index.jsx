import { useState, useEffect } from "react";
import { read, writeFileXLSX, utils } from "xlsx";

function Test() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // readWorkbookFromRemoteFile(
    //   "http://tpsservice-files-inner.cn-hangzhou.oss-cdn.aliyun-inc.com/files/resources/WB01161624/a29d7807deed19bc1fb1f1714edfe6e2.xlsx?spm=a1zmmc.index.0.0.f1b7719dYFCDMS&file=a29d7807deed19bc1fb1f1714edfe6e2.xlsx"
    // );
  });

  // 从网络上读取某个excel文件，url必须同域，否则报错
  function readWorkbookFromRemoteFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (e) {
      if (xhr.status == 200) {
        var data = new Uint8Array(xhr.response);
        var workbook = read(data, { type: "array" });
        if (callback) callback(workbook);
      }
    };
    xhr.send();
  }

  const onchange = (e) => {
    console.log("onchange --> e", e, e.target.files);
    if (e.target.files.length === 0) {
      console.log("请选择文件！");
      return;
    }
    var files = e.target.files;
    var fileReader = new FileReader();
    fileReader.onload = function (ev) {
      var data = ev.target.result;
      const wb = read(data, {
        type: "binary",
        cellNF: true,
        raw: true,
      });
      console.log("wb :>> ", wb);
      const result = [];
      wb.SheetNames.forEach((sheetName) => {
        const sheet = {};
        Object.keys(wb.Sheets[sheetName]).forEach(
          (item) =>
            (sheet[item] =
              item.indexOf("!") === 0
                ? wb.Sheets[sheetName][item]
                : {
                    ...wb.Sheets[sheetName][item],
                    v: wb.Sheets[sheetName][item].h,
                  })
        );
        console.log("sheet :>> ", sheet);
        const excel = {
          sheetName: sheetName,
          sheet: utils.sheet_to_json(sheet, {
            header: ["link", "type", "question", "answer"],
          }),
        };
        result.push(excel);
      });
      const resList = [...result[0].sheet];
      resList.shift();
      resList.forEach((item, index) => {
        const {
          link = resList[index - 1].link,
          type = resList[index - 1].type,
          question,
          answer,
        } = item;
        resList[index] = { link, type, question, answer };
      });
      console.log("resList", resList);
      const res = resList.reduce((acc, { link, type, question, answer }) => {
        const accList = { ...acc };
        if (accList[link]) {
          if (accList[link][type]) {
            accList[link][type] = [
              ...accList[link][type],
              { question, answer },
            ];
          } else {
            accList[link][type] = [{ question, answer }];
          }
        } else {
          accList[link] = {};
          accList[link][type] = [{ question, answer }];
        }
        return accList;
      }, {});
      console.log("res", JSON.stringify(res));
    };
    fileReader.readAsBinaryString(files[0]);
  };

  return (
    <input type="file" onChange={onchange} />
  );
}

export default Test;
