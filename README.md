Google doesn't like you any more? While you are trying to fix the mess, make sure you make the most out of all the other search engines!

Instant, low-config indexing script that submits the URLs in your sitemaps to **_Bing_** (and thereby **_DuckDuckGo_**), **_Naver_**, **_Seznam.cz_**, **_Yandex_**, and **_Yep_** for indexing.

# 1. Quickstart

## 1.1 Install

```sh
$ git clone https://github.com/mxmzb/indexnow-indexing-script
$ cd ./indexnow-indexing-script
$ yarn
# OR
$ npm install
```

## 1.2 Configure

1. Head over to [https://api-keygen.com/](https://api-keygen.com/) and generate any key (I personally prefer 32 character hex).
2. Create a file named `example.com/[your-generated-api-key].txt` for the domain that you want to index. In the file should, again, be the API key, and only the generated API key
3. Rename `./config/example.yaml` to `[your-project-identifier].yaml` and change the values inside based on the explanations in comments

_Note: It does not matter at all how you name the .yaml config file in step 3. It can be entirely arbitrary (I like to use the domain name without the domain ending). The project identifier is exclusively for you to know what site the config belongs to._

## 1.3 Run

```sh
$ yarn index
# OR
$ npm run index
```
