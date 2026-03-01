"""
Auth 도메인 Calculator
Java PasswordEncUtil.java 로직 이식: MD5 해시 후 Base64 인코딩
"""

import base64
import hashlib


class PasswordCalculator:
    """
    비밀번호 암호화 Calculator

    기존 Java PasswordEncUtil.java와 동일한 로직:
    1. 입력 문자열을 UTF-8 바이트로 변환
    2. MD5 해시 계산 (16바이트 digest)
    3. Base64 인코딩하여 문자열 반환

    순수 함수 기반, 외부 의존성/부수효과 없음.
    """

    @staticmethod
    def encode(plain_password: str) -> str:
        """
        비밀번호를 MD5 → Base64 방식으로 인코딩합니다.

        Args:
            plain_password: 평문 비밀번호

        Returns:
            str: MD5 해시를 Base64로 인코딩한 문자열 (약 24자)
        """
        md5_bytes = hashlib.md5(plain_password.encode("utf-8")).digest()
        return base64.b64encode(md5_bytes).decode("utf-8")

    @staticmethod
    def verify(plain_password: str, encoded_password: str) -> bool:
        """
        평문 비밀번호와 DB에 저장된 인코딩 값을 비교합니다.

        Args:
            plain_password: 사용자가 입력한 평문 비밀번호
            encoded_password: DB에 저장된 인코딩된 비밀번호

        Returns:
            bool: 일치 여부
        """
        return PasswordCalculator.encode(plain_password) == encoded_password
