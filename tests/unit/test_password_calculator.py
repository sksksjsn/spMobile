"""
단위 테스트: PasswordCalculator
Java PasswordEncUtil.java 로직 이식 검증 (MD5 -> Base64)
"""

import pytest

from server.app.domain.auth.calculators.password_calculator import PasswordCalculator


class TestPasswordCalculatorEncode:
    """PasswordCalculator.encode() 단위 테스트"""

    def test_encode_known_value(self):
        """
        "password" -> MD5 -> Base64 결과가 Java PasswordEncUtil과 동일한지 검증.
        Java: MessageDigest.getInstance("MD5").digest("password".getBytes())
              -> Base64.encodeBase64(md5bytes)
              -> "X03MO1qnZdYdgyfeuILPmQ=="
        """
        result = PasswordCalculator.encode("password")
        assert result == "X03MO1qnZdYdgyfeuILPmQ=="

    def test_encode_empty_string(self):
        """빈 문자열도 인코딩 가능해야 합니다 (MD5("") -> Base64)."""
        result = PasswordCalculator.encode("")
        # MD5("") = d41d8cd98f00b204e9800998ecf8427e (hex)
        # Base64 of that 16-byte digest = "1B2M2Y8AsgTpgAmY7PhCfg=="
        assert result == "1B2M2Y8AsgTpgAmY7PhCfg=="

    def test_encode_korean_characters(self):
        """한글 입력이 UTF-8로 인코딩되어 처리되어야 합니다."""
        result = PasswordCalculator.encode("비밀번호")
        assert isinstance(result, str)
        assert len(result) > 0

    def test_encode_returns_base64_format(self):
        """결과가 Base64 형식 문자열(24자, '=' 패딩 포함)이어야 합니다."""
        result = PasswordCalculator.encode("any_password")
        # MD5 digest = 16 bytes -> Base64 = 24 chars (with padding)
        assert len(result) == 24
        assert result.endswith("=")

    def test_encode_is_deterministic(self):
        """동일한 입력에 대해 항상 동일한 결과를 반환해야 합니다."""
        pw = "mySecretPassword123!"
        assert PasswordCalculator.encode(pw) == PasswordCalculator.encode(pw)

    def test_encode_different_inputs_produce_different_outputs(self):
        """다른 입력은 다른 결과를 반환해야 합니다."""
        r1 = PasswordCalculator.encode("password1")
        r2 = PasswordCalculator.encode("password2")
        assert r1 != r2


class TestPasswordCalculatorVerify:
    """PasswordCalculator.verify() 단위 테스트"""

    def test_verify_correct_password(self):
        """올바른 비밀번호 비교 시 True를 반환해야 합니다."""
        encoded = PasswordCalculator.encode("password")
        assert PasswordCalculator.verify("password", encoded) is True

    def test_verify_wrong_password(self):
        """잘못된 비밀번호 비교 시 False를 반환해야 합니다."""
        encoded = PasswordCalculator.encode("password")
        assert PasswordCalculator.verify("wrong_password", encoded) is False

    def test_verify_with_known_db_value(self):
        """
        DB에 저장된 값("X03MO1qnZdYdgyfeuILPmQ==")과
        평문 "password"를 비교합니다. (Java 기존 시스템과의 호환성 검증)
        """
        db_stored = "X03MO1qnZdYdgyfeuILPmQ=="
        assert PasswordCalculator.verify("password", db_stored) is True

    def test_verify_empty_vs_nonempty(self):
        """빈 문자열과 비어있지 않은 비밀번호는 일치하지 않아야 합니다."""
        encoded = PasswordCalculator.encode("password")
        assert PasswordCalculator.verify("", encoded) is False

    def test_verify_case_sensitive(self):
        """비밀번호 비교는 대소문자를 구분해야 합니다."""
        encoded = PasswordCalculator.encode("Password")
        assert PasswordCalculator.verify("password", encoded) is False
        assert PasswordCalculator.verify("Password", encoded) is True
