const container = document.querySelector('.container')

let source;
container.ondragstart = (e) =>{
  e.dataTransfer.effectAllowed = e.target.dataset.effect;
  source = e.target;
}

container.ondragover = (e) =>{
  e.preventDefault();
  // console.log('over',e.target);
}

function getDropNode(node) {
  while (node) {
    if (node.dataset && node.dataset.drop) {
      return node;
    }
    node = node.parentNode;
  }
}

function clearDropStyle() {
  document.querySelectorAll('.drop-over').forEach((node) =>{
    node.classList.remove('drop-over');
  })
}

container.ondragenter = (e) =>{
  clearDropStyle()
  const dropNode = getDropNode(e.target);
  if (dropNode && dropNode.dataset.drop === e.dataTransfer.effectAllowed) {
    /// 该节点能够接受目前拖拽节点
    dropNode.classList.add('drop-over');
    // console.log('over',e.target);
  }

}

container.ondrop = (e) =>{
  clearDropStyle()
  const dropNode = getDropNode(e.target);
  if (dropNode && dropNode.dataset.drop === e.dataTransfer.effectAllowed) {
    if (dropNode.dataset.drop === 'copy') {
      dropNode.innerHTML = '';
      const cloned = source.cloneNode(true);
      cloned.dataset.effect = 'move';
      dropNode.appendChild(cloned);
    } else {
      source.remove();
    }
  }
}

// 增减日期
const add_date = document.querySelector('.add-date');
let reduce_date_all = document.querySelectorAll('.reduce-date');

reduce_date_action();

add_date.onmouseover = (e) => {
  if (reduce_date_all.length < 2) {
    add_date.innerHTML = "增加日期";
    add_date.classList.add("drop-over");
    add_date.style = "cursor: pointer;";
  } else {
    add_date.classList.remove("drop-over");
  }
  reduce_date_all = document.querySelectorAll('.reduce-date');
}
add_date.onmouseleave = (e) => {
  add_date.innerHTML = "星期五";
  add_date.style = "";
  add_date.classList.remove("drop-over")
}

add_date.onclick = function(event) {
  if (reduce_date_all.length < 2) {
    let table = document.querySelector('.table');
    let row = table.rows; // Getting the rows
    // console.log(row)
    for (let i = 0;i< row.length;i++) {
      if (i===0) {
        let th = document.createElement("th");
        if (reduce_date_all.length === 0) {
          th.innerHTML = "星期六";
        } else {
          th.innerHTML = "星期日";
        }
        th.classList.add("span");
        th.classList.add("reduce-date");
        row[i].append(th)
      }else {
        let td = document.createElement("td");
        td.innerHTML = "";
        td.dataset.drop = "copy"
        row[i].append(td)
      }
    }
  }
  reduce_date_all = document.querySelectorAll('.reduce-date');
  reduce_date_action();
}

function reduce_date_action() {
  reduce_date_all.forEach((e) =>
    e.onmouseover = (v) => {
      e.innerHTML = "减少日期";
      e.classList.add("drop-over");
      e.style = "cursor: pointer;";
    })

  reduce_date_all.forEach((e,i) =>
    e.onmouseleave = (v) => {
      if (i===0) {
        e.innerHTML = "星期六";
      } else {
        e.innerHTML = "星期日";
      }
      e.classList.remove("drop-over");
      e.style = "";
    })

  reduce_date_all.forEach((e) => e.onclick = function(event) {
    let table = document.querySelector('.table');
    let row = table.rows; // Getting the rows
    for (let i = 0;i< row.length;i++) {
      row[i].lastElementChild.remove();
    }
    reduce_date_all = document.querySelectorAll('.reduce-date');
  })
}

function download() {
  html2canvas(document.querySelector(".right")).then(canvas => {
    console.log(canvas.toDataURL())
    const a = document.createElement('a')
    a.href = canvas.toDataURL()
    a.download = document.querySelector('h1').innerHTML + ".png"
    a.click()
  });
}
function make() {
  let r =confirm("确认重新制作？会清除已存在数据");
  if (!r) {
    return
  }
  const sw = parseInt(document.getElementsByName('sw')[0].value);
  const xw = parseInt(document.getElementsByName('xw')[0].value);
  console.log(sw,xw)
  let tbody = document.querySelector('tbody');
  // 先删除
  tbody.remove();
  // 再新增
  let table = document.querySelector('table');
  let rows = table.rows[0].cells.length;
  // console.log(rows);
  tbody = document.createElement('tbody');
  for (let i = 0;i < sw + xw;i++) {
    let tr = document.createElement('tr');
    for (let j = 0;j < rows;j++) {
      let td;
      if (j === 0) {
        if (i === 0) {
          td = document.createElement('th');
          td.classList.add("span");
          td.innerHTML = "上午";
          td.setAttribute('rowspan',sw);
        }
        if (i === sw) {
          td = document.createElement('th');
          td.classList.add("span");
          td.innerHTML = "下午";
          td.setAttribute('rowspan',xw);
        }
      } else {
        td = document.createElement('td');
        td.dataset.drop = 'copy';
      }
      if (td) {
        tr.appendChild(td);
      }
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
}


