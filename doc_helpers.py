"""
SalesStorm Implementation Code Documentation Generator
Generates a comprehensive, professional Microsoft Word document (.docx)
documenting the complete actual implementation of the SalesStorm project.
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

# Define Brand Palette Constants
COLOR_NAVY_HEX = "14213D"      # Oxford Navy
COLOR_AMBER_HEX = "FCA311"     # Amber Gold
COLOR_SLATE_HEX = "334DAF"     # Slate Royal Blue
COLOR_DARK_HEX = "1E293B"      # Slate 800 Dark
COLOR_LIGHT_HEX = "F5F6F8"     # Half-white / Off-white
COLOR_WHITE_HEX = "FFFFFF"     # Pure White
COLOR_BORDER_HEX = "CBD5E1"    # Slate 300 Border
COLOR_MUTED_HEX = "64748B"     # Slate 500 Text

COLOR_NAVY = RGBColor(20, 33, 61)
COLOR_AMBER = RGBColor(252, 163, 17)
COLOR_SLATE = RGBColor(51, 77, 175)
COLOR_DARK = RGBColor(30, 41, 59)
COLOR_MUTED = RGBColor(100, 116, 139)

def set_cell_background(cell, hex_color):
    """Sets cell shading background color."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    """Sets padding/margins for a table cell in dxa (1 pt = 20 dxa)."""
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    """Applies clean subtle borders to the table."""
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="none"/>'
            f'<w:left w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr[0].append(borders)

def format_table(table, col_widths, headers, data, align_cols=None):
    """Formats a modern, premium table with styled header and alternating rows."""
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table, COLOR_BORDER_HEX)
    
    # Header Row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], COLOR_NAVY_HEX)
        set_cell_margins(hdr_cells[i], top=140, bottom=140, left=180, right=180)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.bold = True
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.name = "Segoe UI"
            
    # Data Rows
    for r_idx, row_data in enumerate(data):
        row_cells = table.add_row().cells
        bg_hex = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = str(val)
            set_cell_background(row_cells[c_idx], bg_hex)
            set_cell_margins(row_cells[c_idx], top=100, bottom=100, left=180, right=180)
            p = row_cells[c_idx].paragraphs[0]
            if align_cols and c_idx in align_cols:
                p.alignment = align_cols[c_idx]
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.size = Pt(9)
                run.font.name = "Segoe UI"
                run.font.color.rgb = COLOR_DARK
                
    # Column Widths
    for row in table.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = Inches(width)

def add_callout(doc, text, title="ARCHITECTURE NOTE", callout_type="info"):
    """Adds a callout block with colored left border and subtle shading."""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    
    border_color = COLOR_AMBER_HEX if callout_type == "warning" else (COLOR_SLATE_HEX if callout_type == "info" else COLOR_NAVY_HEX)
    bg_color = "FFFBEB" if callout_type == "warning" else "F8FAFC"
    
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=180)
    
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="36" w:space="0" w:color="{border_color}"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    run_title = p.add_run(f"[{title}] ")
    run_title.bold = True
    run_title.font.size = Pt(9.5)
    run_title.font.name = "Segoe UI"
    run_title.font.color.rgb = COLOR_AMBER if callout_type == "warning" else COLOR_SLATE
    
    run_text = p.add_run(text)
    run_text.font.size = Pt(9)
    run_text.font.name = "Segoe UI"
    run_text.font.color.rgb = COLOR_DARK
    
    # Add small spacing after table
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(6)

def add_code_block(doc, code_str, caption=None):
    """Adds a syntax-friendly monospace code block with dark or light container."""
    if caption:
        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.space_before = Pt(8)
        p_cap.paragraph_format.space_after = Pt(2)
        r_cap = p_cap.add_run(f"Listing: {caption}")
        r_cap.font.name = "Segoe UI Semibold"
        r_cap.font.size = Pt(9)
        r_cap.font.color.rgb = COLOR_SLATE
        r_cap.bold = True
        
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    
    set_cell_background(cell, "0F172A") # Dark slate code background
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="18" w:space="0" w:color="{COLOR_AMBER_HEX}"/>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="334155"/>'
        f'<w:right w:val="single" w:sz="6" w:space="0" w:color="334155"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="334155"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(code_str)
    run.font.name = "Consolas"
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(226, 232, 240)
    
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(6)

print("Helper definitions loaded successfully.")
