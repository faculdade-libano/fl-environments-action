<!--
Copyright 2021 Instituto Libano

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Instituto Libano :package: `fl-environments-action`

This action deserialize a dynamic file structure contained in a repository, compresses it and generates a secret.

## :hammer_and_wrench: Usage 

```yaml
- name: Create Secret
  uses: faculdade-libano/fl-environments-action@main
  with:
    action: write
    token: ${{ secrets.MY_TOKEN }}
    org: faculdade-libano
    visibility: all
    environment: production
```

It's worth remembering though that secrets are limited to 64 KB.

## License

See [LICENSE](LICENSE).
