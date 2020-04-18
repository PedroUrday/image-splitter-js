window.onload = function () {
	var file_input = document.getElementById('file_input');
	var split_by_width = document.getElementById('split_by_width');
	var split_by_cols = document.getElementById('split_by_cols');
	var split_by_height = document.getElementById('split_by_height');
	var split_by_rows = document.getElementById('split_by_rows');
	var rows_elem = document.getElementById('rows');
	var cols_elem = document.getElementById('cols');
	var block_width_elem = document.getElementById('block_width');
	var block_height_elem = document.getElementById('block_height');
	var quality = document.getElementById('quality');
	var result = document.getElementById('result');
	var download_all_btn = document.getElementById('download_all_btn');
	var reset_btn = document.getElementById('reset_btn');
	var image_parts_src = [];
	var image_parts_names = [];
	var file, image, prefix;

	function onOutputParamsChange() {
		result.innerHTML = '';
		download_all_btn.disabled = true;

		var error = false;

		if (split_by_width.checked) {
			var block_width = parseInt(block_width_elem.value);
			var cols_count = image.naturalWidth / block_width;
			if (cols_count != Math.floor(cols_count)) {
				error = true;
			}
		} else if (split_by_cols.checked) {
			var cols_count = parseInt(cols_elem.value);
			var block_width = image.naturalWidth / cols_count;
			if (block_width != Math.floor(block_width)) {
				error = true;
			}
		} else {
			return;
		}

		if (split_by_height.checked) {
			var block_height = parseInt(block_height_elem.value);
			var rows_count = image.naturalHeight / block_height;
			if (rows_count != Math.floor(rows_count)) {
				error = true;
			}

		} else if (split_by_rows.checked) {
			var rows_count = parseInt(rows_elem.value);
			var block_height = image.naturalHeight / rows_count;
			if (block_height != Math.floor(block_height)) {
				error = true;
			}
		} else {
			return;
		}

		if (error) {
			result.innerHTML = '<strong>Error! All blocks are not equal with or are not equal height.</strong>';
			return;
		}

		var canvas = document.createElement('canvas');
		canvas.width = block_width;
		canvas.height = block_height;
		var context = canvas.getContext('2d');
		image_parts_src = [];
		image_parts_names = [];
		var table = document.createElement('table');
		result.appendChild(table);
		for (var i = 0; i < rows_count; i++) {
			image_parts_src[i] = [];
			image_parts_names[i] = [];
			var table_row = document.createElement('tr');
			table.appendChild(table_row);
			for (var j = 0; j < cols_count; j++) {
				context.clearRect(0, 0, block_width, block_height);
				context.drawImage(image, j * block_width, i * block_height, block_width, block_height, 0, 0, block_width, block_height);
				var image_part = new Image();
				var image_part_src = canvas.toDataURL(file.type, parseFloat(quality.value));
				image_part.src = image_part_src;
				image_parts_src[i][j] = image_part_src;
				var image_part_name = document.createElement('input');
				image_part_name.type = 'text';
				image_part_name.value = 'row-' + (i + 1) + '-col-' + (j + 1);
				image_parts_names[i][j] = image_part_name;
				var preview = document.createElement('div');
				preview.className = 'preview';
				preview.appendChild(image_part);
				preview.appendChild(image_part_name);
				var table_cell = document.createElement('td');
				table_cell.appendChild(preview);
				table_row.appendChild(table_cell);
			}
		}
		download_all_btn.disabled = false;
	}

	rows_elem.onchange = onOutputParamsChange;
	cols_elem.onchange = onOutputParamsChange;
	block_height_elem.onchange = onOutputParamsChange;
	block_width_elem.onchange = onOutputParamsChange;
	quality.onchange = onOutputParamsChange;

	function check_params() {
		if ((split_by_cols.checked || split_by_width.checked) && (split_by_rows.checked || split_by_height.checked)) {
			onOutputParamsChange();
		}
	}

	split_by_cols.onchange = function () {
		if (split_by_cols.checked) {
			cols_elem.disabled = false;
		} else {
			cols_elem.disabled = true;
		}
		check_params();
	};

	split_by_width.onchange = function () {
		if (split_by_width.checked) {
			block_width_elem.disabled = false;
		} else {
			block_width_elem.disabled = true;
		}
		check_params();
	};

	split_by_rows.onchange = function () {
		if (split_by_rows.checked) {
			rows_elem.disabled = false;
		} else {
			rows_elem.disabled = true;
		}
		check_params();
	};

	split_by_height.onchange = function () {
		if (split_by_height.checked) {
			block_height_elem.disabled = false;
		} else {
			block_height_elem.disabled = true;
		}
		check_params();
	};

	function onFileInputChange() {
		split_by_cols.checked = false;
		split_by_cols.disabled = true;

		split_by_width.checked = false;
		split_by_width.disabled = true;

		split_by_rows.checked = false;
		split_by_rows.disabled = true;

		split_by_height.checked = false;
		split_by_height.disabled = true;

		rows_elem.value = '1';
		rows_elem.disabled = true;

		cols_elem.value = '1';
		cols_elem.disabled = true;

		block_width_elem.value = '';
		block_width_elem.disabled = true;

		block_height_elem.value = '';
		block_height_elem.disabled = true;

		quality.value = '0.92';

		if (file_input.value == '' || file_input.files.length == 0) {
			return;
		}
		file = file_input.files[0];

		if (file.type == 'image/jpeg' || file.type == 'image/png') {
			if (file.type == 'image/png') {
				if (file.name.toLowerCase().endsWith('.png')) {
					prefix = file.name.slice(0, -4);
				} else {
					prefix = file.name;
				}
			} else {
				if (file.name.toLowerCase().endsWith('.jpg')) {
					prefix = file.name.slice(0, -4);
				} else {
					prefix = file.name;
				}
			}

			var img = new Image();
			img.onload = function () {
				image = img;
				block_width_elem.value = image.naturalWidth;
				block_height_elem.value = image.naturalHeight;

				split_by_cols.disabled = false;
				split_by_width.disabled = false;
				split_by_rows.disabled = false;
				split_by_height.disabled = false;
				if (file.type == 'image/jpeg') {
					quality.disabled = false;
				} else {
					quality.disabled = true;
				}

				onOutputParamsChange();
			};
			img.onerror = function () {
				result.innerHTML = '<strong>Error while reading image file.</strong>';
			};
			img.src = URL.createObjectURL(file);
		} else {
			result.innerHTML = '<strong>Error! Unsupported file format.</strong>';
		}
	};

	file_input.onchange = onFileInputChange;

	function reset() {
		file_input.value = '';
		onFileInputChange();
		result.innerHTML = '';
	}

	reset_btn.onclick = reset;

	download_all_btn.onclick = function () {
		var rows_count = image_parts_src.length;
		var cols_count = image_parts_src[0].length;
		var loading = rows_count * cols_count;
		var zip = new JSZip();
		var folder = zip.folder(prefix);
		for (var i = 0; i < rows_count; i++) {
			for (var j = 0; j < cols_count; j++) {
				var dataURI = image_parts_src[i][j];
				var filename = image_parts_names[i][j].value;
				if (file.type == 'image/jpeg') {
					filename += '.jpg';
				} else {
					filename += '.png';
				}
				folder.file(filename, dataURI.split(',')[1], {
					base64: true
				});
			}
		}
		zip.generateAsync({
			type: 'blob'
		}).then(function (blob) {
			var filename = prefix + '.zip';
			var a = document.createElement('a');
			a.setAttribute('href', URL.createObjectURL(blob));
			a.setAttribute('download', filename);
			a.style.display = 'none';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	};
};