<!--
Copyright 2021 Envio Simples

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

# Envio Simples :package: `es-environments-action`

This action deserialize a dynamic file structure contained in a repository, compresses it and generates a secret.

## :hammer_and_wrench: Usage 

```yaml
- name: Create Secret
  uses: envio-simples/es-environments-action@main
  with:
    action: write
    token: ${{ secrets.MY_TOKEN }}
    org: envio-simples
    visibility: all
    environment: production
```

It's worth remembering though that secrets are limited to 64 KB.

## License

See [LICENSE](LICENSE).