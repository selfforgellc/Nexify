"""Smoke test that the tmp_nexify_home fixture works."""

from __future__ import annotations

from pathlib import Path

from nexify.core import config as config_mod


def test_fixture_redirects_default_config_dir(tmp_nexify_home: Path) -> None:
    assert config_mod.DEFAULT_CONFIG_DIR == tmp_nexify_home
    assert tmp_nexify_home.exists()
    assert (tmp_nexify_home / ".state").exists()
    assert (tmp_nexify_home / ".state" / "models").exists()


def test_fixture_redirects_config_path(tmp_nexify_home: Path) -> None:
    assert config_mod.DEFAULT_CONFIG_PATH == tmp_nexify_home / "config.toml"

