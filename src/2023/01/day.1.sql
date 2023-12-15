WITH
    raw_input AS (
        SELECT
            L.[ordinal],
            L.[value]
        FROM 
            openrowset(BULK '/src/day.1.input.txt', SINGLE_CLOB) AS I
            CROSS APPLY string_split(I.[BulkColumn], CHAR(10), 1) AS L
        WHERE
            1 = 1
            AND (L.[value] <> '')
    ),
    N0 AS ( SELECT 1 AS [n] UNION ALL SELECT 1),                                               -- 2 rows
    N1 AS ( SELECT 1 AS [n] FROM N0 AS A, N0 AS B),                                            -- 4 rows
    N2 AS ( SELECT 1 AS [n] FROM N1 AS A, N1 AS B),                                            -- 16 rows
    N3 AS ( SELECT row_number() OVER ( ORDER BY (SELECT NULL) ) AS [n] FROM N2 AS A, N2 AS B), -- 256 rows
    p1_digits AS (
        SELECT
            I.[ordinal] AS [Line],
            try_cast(substring(I.[value], N.[n], 1) AS int) AS [Digit],
            row_number() OVER ( PARTITION BY I.[ordinal] ORDER BY N.[n] )AS [Index]
        FROM
            raw_input AS I
            CROSS JOIN N3 AS N
        WHERE
            1 = 1
            AND (substring(I.[value], N.[n], 1) <> '')
    ),
    part_1 AS (
        SELECT
            sum(10 * D1.[Digit] + D2.[Digit]) AS [Answer]
        FROM 
            (
                SELECT
                    D.[Line],
                    min(D.[Index]) AS [MinDigitIndex],
                    max(D.[Index]) AS [MaxDigitIndex]
                FROM
                    p1_digits AS D
                WHERE
                    1 = 1
                    AND (D.[Digit] <> 0)
                GROUP BY
                    D.[Line]
            ) AS src
            JOIN p1_digits D1 ON (D1.[Line] = src.[Line]) AND (D1.[Index] = src.[MinDigitIndex])
            JOIN p1_digits D2 ON (D2.[Line] = src.[Line]) AND (D2.[Index] = src.[MaxDigitIndex])
    ),
    p2_digits AS (
        SELECT
            I.[ordinal] AS [Line],
            try_cast(
                substring(
                    replace(replace(replace(replace(replace(replace(replace(replace(replace(I.[value], 'one', 'one1one'), 'two', 'two2two'), 'three', 'three3three'), 'four', 'four4four'), 'five', 'five5five'), 'six', 'six6six'), 'seven', 'seven7seven'), 'eight', 'eight8eight'), 'nine', 'nine9nine'),
                    N.[n],
                    1
                ) AS int
            ) AS [Digit],
            row_number() OVER ( PARTITION BY I.[ordinal] ORDER BY N.[n] )AS [Index]
        FROM
            raw_input AS I
            CROSS JOIN N3 AS N
        WHERE
            1 = 1
            AND (
                substring(
                    replace(replace(replace(replace(replace(replace(replace(replace(replace(I.[value], 'one', 'one1one'), 'two', 'two2two'), 'three', 'three3three'), 'four', 'four4four'), 'five', 'five5five'), 'six', 'six6six'), 'seven', 'seven7seven'), 'eight', 'eight8eight'), 'nine', 'nine9nine'),
                    N.[n],
                    1
                ) <> ''
            )
    ),
    part_2 AS (
        SELECT
            sum(10 * D1.[Digit] + D2.[Digit]) AS [Answer]
        FROM 
            (
                SELECT
                    D.[Line],
                    min(D.[Index]) AS [MinDigitIndex],
                    max(D.[Index]) AS [MaxDigitIndex]
                FROM
                    p2_digits AS D
                WHERE
                    1 = 1
                    AND (D.[Digit] <> 0)
                GROUP BY
                    D.[Line]
            ) AS src
            JOIN p2_digits D1 ON (D1.[Line] = src.[Line]) AND (D1.[Index] = src.[MinDigitIndex])
            JOIN p2_digits D2 ON (D2.[Line] = src.[Line]) AND (D2.[Index] = src.[MaxDigitIndex])
    )
SELECT
    P1.[Answer] AS [Part1],
    P2.[Answer] AS [Part2]
FROM
    part_1 AS P1,
    part_2 AS P2;