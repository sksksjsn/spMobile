/**
 * System 도메인 타입 정의
 */

/**
 * DB 연결 테스트 응답
 */
export interface DBCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * TestTable 레코드
 */
export interface TestTableItem {
  id: number;
  name: string;
}

/**
 * ORM 테스트 응답
 */
export interface OrmTestResponse {
  success: boolean;
  message: string;
  inserted: TestTableItem;
  all_records: TestTableItem[];
}
