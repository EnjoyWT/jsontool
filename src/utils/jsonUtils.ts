import jsonlint from 'jsonlint-mod';
import yaml from 'js-yaml';
import convert from 'xml-js';
import beautify from 'js-beautify';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

export const formatJson = (text: string): string => {
  try {
    // 使用 js-beautify 进行美化，它比原生的 JSON.stringify 更强大，可以处理带注释的 JSON
    return beautify.js_beautify(text, {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: 0,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    });
  } catch (e) {
    return text;
  }
};

export const minifyJson = (text: string): string => {
  const obj = JSON.parse(text);
  return JSON.stringify(obj);
};

export const validateJson = (text: string): ValidationResult => {
  if (!text.trim()) return { valid: false, error: '内容为空' };
  try {
    jsonlint.parse(text);
    return { valid: true };
  } catch (e: any) {
    const message = e.message || String(e);
    const lineMatch = message.match(/line (\d+)/i);
    const colMatch = message.match(/column (\d+)/i);
    return {
      valid: false,
      error: message,
      line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
      column: colMatch ? parseInt(colMatch[1], 10) : undefined
    };
  }
};

export const sortJsonKeys = (text: string): string => {
  const obj = JSON.parse(text);
  const sortObj = (item: any): any => {
    if (Array.isArray(item)) return item.map(sortObj);
    if (item !== null && typeof item === 'object') {
      return Object.keys(item).sort().reduce((acc: any, key) => {
        acc[key] = sortObj(item[key]);
        return acc;
      }, {});
    }
    return item;
  };
  return JSON.stringify(sortObj(obj), null, 2);
};

export const jsonToYaml = (text: string): string => {
  const obj = JSON.parse(text);
  return yaml.dump(obj);
};

export const jsonToXml = (text: string): string => {
  const obj = JSON.parse(text);
  return convert.js2xml(obj, { compact: true, spaces: 2 });
};

export const escapeJson = (text: string): string => {
  return text.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
};

export const unescapeJson = (text: string): string => {
  return text.replace(/\\"/g, "\"").replace(/\\\\/g, "\\");
};

export const unicodeToChinese = (text: string): string => {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_match, grp) => {
    return String.fromCharCode(parseInt(grp, 16));
  });
};

export const chineseToUnicode = (text: string): string => {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code > 127) {
      return "\\u" + code.toString(16).padStart(4, '0');
    }
    return char;
  }).join('');
};
