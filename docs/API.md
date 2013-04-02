求職小幫手API
=============

取得目前所有資料包清單
----------------------
網址 http://jobhelper.g0v.ronny.tw/api/getpackages

Package 資訊：
* id : 資料包 ID ，下一個 API 會用到
* name : 資料包名稱
* url : 資料包網址
* updated_at : 資料包介紹等資訊更新時間
* package_time : 資料包內容的更新時間（是否要重新下載資料包要從這邊判斷)
* default : 這個資料包是否要預設被勾選，適用於新增資料包後使用者不需要來重新勾選的資料。


取得單一資料包
--------------
網址 http://jobhelper.g0v.ronny.tw/api/getpackage?id={資料包ID}

回傳資訊: content 內可以得到一個 array ，裡面每個 row 都是有五個值的 array

五個值分別為:
1. 事業名稱
2. 發生時間
3. 發生事由
4. 原始連結
5. 截圖連結
