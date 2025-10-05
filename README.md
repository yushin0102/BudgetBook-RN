# budgetBook - 記帳小助手 APP

## Husky 初始化 設置 Husky pre-commit hook

1. **創建 pre-commit hook 文件並添加內容**：
    ```sh
    yarn husky-install
    echo '#!/bin/sh' > .husky/pre-commit
    echo '. "$(dirname "$0")/_/husky.sh"' >> .husky/pre-commit
    echo 'npm run lint-staged' >> .husky/pre-commit
    chmod +x .husky/pre-commit
    ```

### 常用指令

```shell
# 查詢套件是否有新版本
yarn outdated
# 針對單一套件升級
yarn add react-native-gesture-handler
# 針對單一套件安裝指定版本
yarn add @tanstack/react-query@5.90.2
# 移除套件
yarn remove react-native-svg

# 重置緩存
yarn start --reset-cache

# 找尋佔用端口服務，並 kill
lsof -i :8081
```

# Android local.properties 設定說明

請每位開發者自行編輯 `/android/local.properties`，
設定自己的本機 Android SDK 路徑（sdk.dir），
如：
sdk.dir=/Users/你的帳號/Library/Android/sdk
