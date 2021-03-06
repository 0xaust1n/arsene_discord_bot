# Arsense Discord Bot 指令解釋

> 指令前綴為 `!` 範例: `!help`  
> 所有指令不分大小寫 參數與指令之間用空格隔開  
> 數個參數的情況下 參數與參數之間用空格隔開

## 一般使用者

### Help

> 顯示所有指令

- 指令簡寫: `?`, `h`
- 接受參數: 無
- 範例: `!help` , `!?`

### Ping

> 測試機器人是否正常回應

- 指令簡寫: 無
- 接受參數: 無
- 範例: `!ping`

### Level

> 查看賭博等級

- 指令簡寫: `lv`, `rank`, `rk`
- 接受參數(非必填): 使用`@` tag 任意成員
- 範例: `!lv` `!lv @AustinBabe`

### Chips

> 查看籌碼數量

- 指令簡寫: `cp`
- 接受參數(非必填): 使用`@` tag 任意成員
- 範例: `!cp` `!cp @AustinBabe`

### Jackpot

> 領取隨即籌碼獎勵 (最多 500)

- 指令簡寫: `jp`, `sp`
- 接受參數: 無
- 冷卻: 2 分鐘
- 範例: `!jp`

### Reward

> 領取定時籌碼獎勵  
> Hourly(每小時) : 600  
> Daily(每天): 2400  
> Weekly(每週): 5000

- 指令簡寫: `rw`
- 接受參數(必填): `hourly`, `h` 為每小時 | `daily`, `d` 為每天 | , `weely` , `w` 為每週
- 冷卻: 1 小時 / 24 小時 / 7 天
- 範例: `!rw h` `!rw daily`

### ClaimAll

> 領取所有定時籌碼獎勵

- 指令簡寫: `ca`
- 接受參數: 無
- 範例: `!ca`

### CoolDown

> 查看所有籌碼獎勵指令冷卻

- 指令簡寫: `cd`
- 接受參數: 無
- 範例: `!cd`

### CoinFlip

> 賭博遊戲
> 拋硬幣 猜正反面贏得對應籌碼數量

- 指令簡寫: `cf`
- 接受參數(1)(必填): `h` / `heads` 為正面 | `t` / `tails` 為反面
- 接受參數(2)(必填): `a` / `all` 為 ALL-IN 全數籌碼 | `<數字>` 為對應數字籌碼
- 範例: `!cf h 10` `!cf heads a`

### Beg

> 向乾爹乞討

- 指令簡寫: `bg`
- 接受參數(1)(必填): 使用`@` tag 任意成員
- 接受參數(2)(必填): `<數字>` 為對應數字籌碼
- 範例: `!beg @Austinbabe 10` `!bg @Austinbabe 100`

## 管理員

### Clear

> 特定筆數清除聊天訊息  
> 不帶參數預設 5 筆

- 指令簡寫: `c`, `cl`
- 接受參數(非必填): `<數字>` 為對應數字訊息
- 範例: `!c 10` `!cl`

---

> Doc 版本 v0.9.28
