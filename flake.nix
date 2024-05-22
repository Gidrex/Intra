{
  description = "A flake for this project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs
            pkgs.sqlite
            pkgs.nodePackages.express
            pkgs.nodePackages.body-parser
            pkgs.nodePackages.sqlite3
          ];

          shellHook = ''
            echo "Welcome to the development shell"
            echo "Run 'npm install' to install local dependencies"
          '';
        };
      });
}
