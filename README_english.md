# About this Repository

This repository automatically syncs the [official release versions](https://github.com/immersive-translate/immersive-translate/releases) daily at 4:00, 10:00, and 16:00 (UTC), and automatically builds and publishes a compatible extension package for Thunderbird. Please visit [Releases of this repository](https://github.com/John-Wong/immersive-translate/releases) page to download the extension package named `thunderbird-immersive-translate-x.x.x.xpi`.
> [!IMPORTANT]
> Use this Thunderbird plugin at your own risk. If you are concerned about personal privacy leaks, use it with caution!

## FAQ

### Can't translate? Floating window not displayed?
Please check if you have installed other plugins that may override the original email reading pane (such as Thunderbird Conversations), as the immersive translate plugin cannot work on top of these plugins.

### Why doesn't the extension work for plain text emails?
This is because Thunderbird wraps the plain text email body with `<pre></pre>` tags to maintain the original formatting, while the immersive translation plugin does not process content within `<pre>` tags by default.

The solution is to go to the plugin's "Options → Developer Settings → Edit User Rules" and add an exception rule to process the content within that `<pre>` tag.
```json
[
  {
    "selectorMatches": [
      ".moz-text-plain"
    ],
    "longBuildPageLength": 1000,
    "isTransformPreTagNewLine": 1,
    "excludeTags.remove": [
      "PRE"
    ],
    "buildContainerSelectors": [
      "pre"
    ]
  }
]
```

### I want to build a historical version that is not in the repository releases
1. Clone this repository and enter the repository directory
  ```bash
  git clone https://github.com/John-Wong/immersive-translate.git && cd immersive-translate
  ```
2. Download and unzip the official source code of the specified historical version
  ```bash
  # Specify the version name
  VERSION=v1.16.12
  curl -sL "https://github.com/immersive-translate/immersive-translate/archive/refs/tags/${VERSION}.tar.gz" -o source.tar.gz
  tar -xzf source.tar.gz --exclude="immersive-translate-${VERSION#v}/README*" --strip-components=1
  ```
3. Copy the firefox directory to the thunderbird directory
  ```bash
  cp -r ./dist/firefox/* ./dist/thunderbird/
  ```
4. Run the migration script
  ```bash
  chmod +x ./scripts/firefox2thunderbird.sh && ./scripts/firefox2thunderbird.sh
  ```
5. Packaging plugins
  ```bash
  # Package the plugin in the repository root directory
  cd ./dist/thunderbird && zip -r "../../thunderbird-immersive-translate-${VERSION#v}.xpi" .
  ```

# Original README

This repository is used to release the Immersive Translate [Release Versions](https://github.com/immersive-translate/immersive-translate/releases) and collect and track user feedback via [Github Issues](https://github.com/immersive-translate/immersive-translate/issues).

[Immersive Translate](https://immersivetranslate.com/) is not open source software, this repository **DOES NOT** contain the source code of Immersive Translate.

> The old version of the [Immersive Translate Open Source Project](github.com/immersive-translate/old-immersive-translate) was archived on January 17, 2023.

[**Click to Install Immersive Translate**](https://immersivetranslate.com/docs/installation/)

Below is a video introduction:

https://github.com/immersive-translate/immersive-translate/assets/62473795/a0e9af51-4a18-45ef-9fc4-0a1509d56ab0
